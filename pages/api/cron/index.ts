import { db } from "@/lib/db"
import { verifySignature } from "@upstash/qstash/nextjs"

async function handler(req, res) {
    const fifteenMinutesAgo = new Date(Date.now() - 1000 * 60 * 15)

    // Update generations as timed out if 15 minutes have passed
    await db.generation.updateMany({
        where: {
            createdAt: {
                lte: fifteenMinutesAgo,
            },
            status: "PROCESSING",
        },
        data: {
            status: "TIMEOUT",
        },
    })

    res.status(200).end()
}

export default verifySignature(handler)

export const config = {
    api: {
        bodyParser: false,
    },
}
