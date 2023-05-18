import { authOptions } from "@/lib/auth"
import { LOCALHOST_IP } from "@/lib/constants"
import { db } from "@/lib/db"
import { ratelimit } from "@/lib/upstash"
import { GENERATIONSATISFCATION } from "@prisma/client"
import { ipAddress } from "@vercel/edge"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

const feedbackBody = z.object({
    inferenceId: z.string(),
    modelId: z.string(),
    satisfaction: z.nativeEnum(GENERATIONSATISFCATION),
    comment: z.string().optional().nullable(),
})

export async function PUT(req: Request, context) {
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

        const { satisfaction, comment, inferenceId, modelId } =
            feedbackBody.parse(body)

        const userFeedbackCreditsGranted = await db.user.findUniqueOrThrow({
            where: {
                id: session.user.id,
            },
            select: {
                feedbackCreditsGranted: true,
            },
        })

        const generation = await db.generation.findUniqueOrThrow({
            where: {
                uniqueGeneration: {
                    inferenceId,
                    modelId,
                },
            },
            include: {
                feedback: true,
            },
        })

        const upsertGenerationFeedback = await db.generationFeedback.upsert({
            where: {
                generationId: generation.id,
            },
            include: {
                generation: true,
            },
            update: {
                satisfaction,
                comment: comment ?? "",
            },
            create: {
                generation: {
                    connect: {
                        id: generation.id,
                    },
                },
                satisfaction,
                comment: comment ?? "",
            },
        })

        if (userFeedbackCreditsGranted?.feedbackCreditsGranted < 3 && comment) {
            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    feedbackCreditsGranted: {
                        increment: 1,
                    },
                    credits: {
                        increment: 1,
                    },
                },
            })
        }

        return new Response(JSON.stringify(upsertGenerationFeedback), {
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
