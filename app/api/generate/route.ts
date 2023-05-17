import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { scenarioGenerators } from "@/lib/generators"
import { supplementalPromptMap } from "@/lib/generators"
import { scenarioAuthToken } from "@/lib/utils"
import { ScenarioInferenceResponse } from "@/types/scenario"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

const generateBody = z.object({
    parameters: z.object({
        modelId: z.string(),
        prompt: z.string().max(500),
        samplingSteps: z.number().min(10).max(100).default(30),
        guidance: z.number().min(0).max(20).default(7),
        numImages: z.number().min(4).max(16).optional().default(4),
        pixelSize: z.number().optional().default(8),
        referenceImage: z.string().optional().nullable(),
        influence: z.number().max(99).min(0).optional().default(25),
    }),
})

const modalityMap = {
    // [scenarioGenerators.fantasyRpg]: "character",
    [scenarioGenerators.landscapePortrait]: "landscape",
    [scenarioGenerators.yoHokki]: "character",
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { parameters } = generateBody.parse(body)

        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new Response(null, { status: 403 })
        }

        const user = await db.user.findUniqueOrThrow({
            where: {
                id: session.user.id,
            },
            select: {
                credits: true,
                generations: {
                    where: {
                        status: "PROCESSING",
                    },
                },
            },
        })

        const pendingGenerationCredits = user.generations.reduce(
            (acc, generation) => acc + generation.numSamples / 4,
            0
        )

        if (parameters.numImages / 4 > user.credits) {
            return new Response(
                JSON.stringify({
                    message:
                        "Purchase more credits to continue generating images, or reduce the amount of images in your generation.",
                }),
                { status: 402 }
            )
        } else if (pendingGenerationCredits >= user.credits) {
            return new Response(
                JSON.stringify({
                    message:
                        "You currently have generations processing that exceed your credit balance. You will have to wait until they are finished before you can generate more images.",
                }),
                { status: 403 }
            )
        }

        const generation: ScenarioInferenceResponse = await fetch(
            `https://api.cloud.scenario.com/v1/models/${parameters.modelId}/inferences`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${scenarioAuthToken}`,
                },
                body: JSON.stringify({
                    parameters: {
                        enableSafetyCheck: false,
                        type: parameters?.referenceImage
                            ? "img2img"
                            : "txt2img",
                        prompt: `${parameters.prompt} ${
                            supplementalPromptMap[parameters.modelId]
                        }`,
                        negativePrompt: "trading cards, cards",
                        numInferenceSteps: parameters.samplingSteps,
                        guidance: parameters.guidance,
                        width: 512,
                        height: 512,
                        numSamples: parameters.numImages,
                        image: parameters?.referenceImage ?? undefined,
                        modality: modalityMap[parameters.modelId] ?? undefined,
                        strength: parameters?.referenceImage
                            ? (100 - parameters?.influence) / 100
                            : undefined,
                    },
                }),
            }
        ).then((res) => res.json())

        await db.generation.create({
            data: {
                prompt: parameters.prompt,
                modelId: parameters.modelId,
                inferenceId: generation.inference.id,
                numSamples: generation.inference.parameters.numSamples,
                numInferenceSteps:
                    generation.inference.parameters.numInferenceSteps,
                guidance: generation.inference.parameters.guidance,
                pixelSize: parameters.pixelSize,
                type: generation.inference.parameters.type,
                strength:
                    generation?.inference?.parameters?.strength ?? undefined,
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        })

        return new Response(JSON.stringify(generation), {
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
