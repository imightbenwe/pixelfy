import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { supabase } from "@/lib/supabase"
import { pixelateImage, scenarioAuthToken } from "@/lib/utils"
import {
    ScenarioInferenceProgressResponse,
    ScenarioPixelateResponse,
} from "@/types/scenario"
import { decode } from "base64-arraybuffer"
import { getServerSession } from "next-auth/next"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const routeContextSchema = z.object({
    params: z.object({
        inferenceId: z.string(),
    }),
})

export const gridSizeToScenarioPixelMap = {
    16: 32,
    8: 64,
    4: 128,
}

export const uploadImage = async (base64String: string) => {
    try {
        const base64FileData = base64String.split("base64,")?.[1]
        if (!base64FileData) {
            throw new Error('Invalid base64 string format');
        }

        const uuid = uuidv4()
        const { data: upload, error } = await supabase.storage
            .from("pixelated")
            .upload(`${uuid}.png`, decode(base64FileData), {
                contentType: "image/png",
                cacheControl: "3600",
                upsert: false,
            })

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(error.message)
        }

        const { data: urlData } = await supabase.storage
            .from("pixelated")
            .getPublicUrl(`${uuid}.png`)


        // Return an object with publicUrl property to match expected structure
        return { publicUrl: urlData.publicUrl }
    } catch (error) {
        console.error('Upload image error:', error);
        throw error;
    }
}

type PixelateImageParams = {
    assetId: string
    pixelGridSize: number
    remoteUrl: string
    colorPaletteEnabled: boolean
    removeBackground?: boolean
    colors: number[][]
}
export const pixelateImageScenario = async ({
    assetId,
    pixelGridSize,
    remoteUrl,
    colorPaletteEnabled,
    colors,
    removeBackground = false,
}: PixelateImageParams) => {
    const pixelateResponse = await fetch(
        `https://api.cloud.scenario.com/v1/generate/pixelate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${scenarioAuthToken}`,
            },
            body: JSON.stringify({
                image: assetId,
                pixelGridSize: gridSizeToScenarioPixelMap[pixelGridSize],
                returnImage: true,
                removeNoise: true,
                removeBackground,
                colorPalette:
                    colorPaletteEnabled && colors?.length > 0
                        ? colors
                        : undefined,
            }),
        }
    )


    if (!pixelateResponse.ok) {
        return pixelateImage({
            remoteUrl,
            pixelSize: pixelGridSize,
        })
    }

    const pixelateData: ScenarioPixelateResponse = await pixelateResponse.json()


    // @ts-ignore
    return pixelateData.asset
}

async function urlToBase64(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
}

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const { params } = routeContextSchema.parse(context)
        const { searchParams } = new URL(req.url)
        const modelId = searchParams.get("modelId")

        if (!modelId) {
            return new Response(null, { status: 400 })
        }

        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new Response(null, { status: 403 })
        }

        // Use the new jobs endpoint instead of inference progress
        const jobProgress = await fetch(
            `https://api.cloud.scenario.com/v1/jobs/${params.inferenceId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${scenarioAuthToken}`,
                },
            }
        ).then((res) => res.json())


        // If the job was successful, process the images and update credits
        if (jobProgress.job.status === "success") {
            // Wrap this in try-catch since findUniqueOrThrow can fail
            try {
                const generation = await db.generation.findUniqueOrThrow({
                    where: {
                        uniqueGeneration: {
                            inferenceId: jobProgress.job.metadata.inferenceId,
                            modelId: modelId,
                        },
                    },
                    include: {
                        outputImages: true,
                    },
                })

                // If already processed, return existing output images
                if (generation.status === "COMPLETE") {
                    return new Response(
                        JSON.stringify({
                            ...jobProgress,
                            outputImages: generation.outputImages,
                        }),
                        { status: 200 }
                    )
                }

                // Process images using assetIds from job metadata
                const assetIds = jobProgress.job.metadata.assetIds
                const pixelatedImagesScenario = await Promise.all(
                    assetIds.map((assetId) => {
                        if (generation.pixelSize === 32) {
                            return pixelateImage({
                                remoteUrl: `https://api.cloud.scenario.com/v1/assets/${assetId}`,
                                pixelSize: generation.pixelSize,
                            })
                        }
                        return pixelateImageScenario({
                            remoteUrl: `https://api.cloud.scenario.com/v1/assets/${assetId}`,
                            assetId,
                            pixelGridSize: generation.pixelSize,
                            colorPaletteEnabled: generation.colorPaletteEnabled,
                            colors: generation.colors as number[][],
                        })
                    })
                )

                const pixelatedImages = await Promise.all(
                    pixelatedImagesScenario.map(async (imageResponse) => {
                        try {
                            // If it's a base64 string (from pixelateImage function)
                            if (typeof imageResponse === 'string') {
                                return uploadImage(imageResponse);
                            }
                            // If it's a response from scenario API
                            if (imageResponse?.url) {
                                const base64Data = await urlToBase64(imageResponse.url);
                                return uploadImage(base64Data);
                            }
                            console.error('Invalid imageResponse:', imageResponse);
                            throw new Error('Invalid image response format');
                        } catch (error) {
                            console.error('Error processing image:', error);
                            throw error;
                        }
                    })
                )


                const imagesWithPixelated = jobProgress.job.metadata.assetIds.map(
                    (assetId, index) => {
                        return {
                            scenarioImageId: assetId,
                            seed: "image",
                            image: pixelatedImages[index].publicUrl,
                            url: pixelatedImages[index].publicUrl,
                            pixelated: pixelatedImages[index].publicUrl,
                        }
                    }
                )


                await db.$transaction([
                    db.user.update({
                        where: {
                            id: session.user.id,
                        },
                        data: {
                            credits: {
                                decrement: generation.numSamples / 4,
                            },
                        },
                    }),
                    db.generation.update({
                        where: {
                            id: generation.id,
                        },
                        data: {
                            status: "COMPLETE",
                            outputImages: {
                                createMany: {
                                    data: imagesWithPixelated.map((image) => {
                                        return {
                                            scenarioImageId: image.scenarioImageId,
                                            image: image.url,
                                            seed: image.seed,
                                            pixelatedImage: image.pixelated,
                                        }
                                    }),
                                },
                            },
                        },
                    }),
                ])

                const outputImages = await db.outputImage.findMany({
                    where: {
                        generationId: generation.id,
                    },
                })

                return new Response(
                    JSON.stringify({
                        ...jobProgress,
                        outputImages,
                    }),
                    { status: 200 }
                )
            } catch (error) {
                // If generation record doesn't exist, return just the job progress
                if (error.code === 'P2025') {
                    return new Response(JSON.stringify(jobProgress), { status: 200 })
                }
                throw error // Re-throw other errors
            }
        } else if (jobProgress.job.status === "failed") {
            const generation = await db.generation.findUniqueOrThrow({
                where: {
                    uniqueGeneration: {
                        inferenceId: params.inferenceId,
                        modelId: modelId,
                    },
                },
            })

            await db.generation.update({
                where: {
                    id: generation.id,
                },
                data: {
                    status: "FAILED",
                },
            })
        }

        return new Response(JSON.stringify(jobProgress), { status: 200 })
    } catch (error) {
        console.log("Error", error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}
