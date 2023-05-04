import { uploadImage } from "../../generate/[inferenceId]/route"
import { authOptions } from "@/lib/auth"
import { LOCALHOST_IP } from "@/lib/constants"
import { db } from "@/lib/db"
import { ratelimit } from "@/lib/upstash"
import { pixelateImage, scenarioAuthToken } from "@/lib/utils"
import { ipAddress } from "@vercel/edge"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

const removeBackgroundBody = z.object({
    imageId: z.string().cuid(),
})

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

        const removeBackground = await fetch(
            `https://api.cloud.scenario.com/v1/images/erase-background`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${scenarioAuthToken}`,
                },
                body: JSON.stringify({
                    // name: `bg-removed-${image.seed}`,
                    assetId: image.scenarioImageId,
                    backgroundColor: "#FFF",
                    format: "png",
                    returnImage: true,
                }),
            }
        ).then((res) => res.json())

        const { publicUrl: prePixelization } = await uploadImage(
            removeBackground.image
        )

        const pixelatedImage = await pixelateImage({
            remoteUrl: prePixelization,
            pixelSize: image.generation.pixelSize,
        })

        const removeBackgroundPixelated = await fetch(
            `https://api.cloud.scenario.com/v1/images/erase-background`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${scenarioAuthToken}`,
                },
                body: JSON.stringify({
                    image: pixelatedImage,
                    name: `bg-removed-${image.seed}`,
                    backgroundColor: "transparent",
                    format: "png",
                    returnImage: true,
                }),
            }
        ).then((res) => res.json())

        const { publicUrl: final } = await uploadImage(
            removeBackgroundPixelated.image
        )

        const newOutputImage = await db.outputImage.create({
            data: {
                seed: image.seed,
                pixelatedImage: final,
                image: prePixelization,
                scenarioImageId: removeBackground.asset.id,
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
