import {
    gridSizeToScenarioPixelMap,
    uploadImage,
} from "../../generate/[inferenceId]/route"
import { authOptions } from "@/lib/auth"
import { LOCALHOST_IP } from "@/lib/constants"
import { db } from "@/lib/db"
import { ratelimit } from "@/lib/upstash"
import { scenarioAuthToken } from "@/lib/utils"
import { ScenarioPixelateResponse } from "@/types/scenario"
import { ipAddress } from "@vercel/edge"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

const removeBackgroundBody = z.object({
    imageId: z.string().cuid(),
})

export const removeBackgroundPixelate = async ({
    assetId,
    pixelGridSize,
    colorPaletteEnabled,
    colors,
}) => {
    const pixelateResponse = await fetch(
        `https://api.cloud.scenario.com/v1/images/pixelate`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${scenarioAuthToken}`,
            },
            body: JSON.stringify({
                assetId,
                pixelGridSize: gridSizeToScenarioPixelMap[pixelGridSize],
                returnImage: true,
                removeNoise: true,
                removeBackground: true,
                colorPalette:
                    colorPaletteEnabled && colors?.length > 0
                        ? colors
                        : undefined,
            }),
        }
    )

    const pixelateData: ScenarioPixelateResponse = await pixelateResponse.json()

    return pixelateData.image
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new Response(null, { status: 403 })
        }

        const ip = ipAddress(req) || LOCALHOST_IP
        const { success } = await ratelimit().limit(ip)

        if (!success) {
            return new Response("Don't DDoS me pls 🥺", { status: 429 })
        }

        const body = await req.json()

        const { imageId } = removeBackgroundBody.parse(body)

        const image = await db.outputImage.findUniqueOrThrow({
            where: {
                id: imageId,
            },
            include: {
                generation: true,
            },
        })

        const removedBackground = await removeBackgroundPixelate({
            assetId: image.scenarioImageId,
            pixelGridSize: image.generation.pixelSize,
            colorPaletteEnabled: image.generation.colorPaletteEnabled,
            colors: image.generation.colors as number[][],
        })

        const { publicUrl: removedBackgroundAsset } = await uploadImage(
            removedBackground
        )

        const newOutputImage = await db.outputImage.create({
            data: {
                seed: image.seed,
                pixelatedImage: removedBackgroundAsset,
                image: removedBackgroundAsset,
                scenarioImageId: image.scenarioImageId,
                generation: {
                    connect: {
                        id: image.generationId,
                    },
                },
            },
        })

        return new Response(JSON.stringify(newOutputImage), {
            status: 201,
        })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(error, { status: 500 })
    }
}
