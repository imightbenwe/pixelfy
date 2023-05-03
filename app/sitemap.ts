import { db } from "@/lib/db"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const images = await db.outputImage.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    })

    const imageSitemapEntry = images.map((image) => {
        return {
            url: `https://pixelfy.ai/i/${image.id}`,
            lastModified: image.updatedAt,
        }
    })

    return [
        {
            url: "https://pixelfy.ai",
            lastModified: new Date(),
        },
        {
            url: "https://pixelfy.ai/tos",
            lastModified: new Date(),
        },
        {
            url: "https://pixelfy.ai/privacy-policy",
            lastModified: new Date(),
        },
        ...imageSitemapEntry,
    ]
}
