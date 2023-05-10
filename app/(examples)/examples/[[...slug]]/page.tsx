import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { scenarioModelData } from "@/lib/generators"
import Image from "next/image"
import Link from "next/link"

interface ExamplePageProps {
    params: {
        slug: string[]
    }
}

export const metadata = {
    title: "Examples",
    description: "View examples of popular generators on Pixelfy",
}

async function getStyleFromParams(params) {
    const slug = params.slug?.join("/") || ""

    if (!slug) {
        null
    }

    const matchingStyle = Object.values(scenarioModelData).find(
        (scenario) => scenario.slug === slug
    )

    if (!matchingStyle) {
        return null
    }

    return db.outputImage.findMany({
        where: {
            id: {
                in: matchingStyle.examples,
            },
        },
        include: {
            generation: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function generateStaticParams(): Promise<
    ExamplePageProps["params"][]
> {
    return Object.keys(scenarioModelData).map((style) => {
        return {
            slug: scenarioModelData[style].slug.split("/"),
        }
    })
}

export default async function DocPage({ params }) {
    const matchingStyle = Object.values(scenarioModelData).find(
        (scenario) => scenario.slug === params.slug?.join("/") || ""
    )
    const images = await getStyleFromParams(params)

    return (
        <DashboardShell>
            <DashboardHeader
                heading={matchingStyle?.name || "Examples"}
                text="View examples of pixel art generations"
            />

            {matchingStyle?.featuredArtist && (
                <div className="flex flex-col items-start">
                    <p>{matchingStyle?.artistInfo?.bio}</p>
                    <Label className="mt-4 text-muted-foreground">
                        Socials
                    </Label>
                    <div className="flex items-center gap-4 mt-4">
                        <a
                            href={matchingStyle.artistInfo?.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.instagram className="h-6 w-6" />
                        </a>
                        <a
                            href={matchingStyle.artistInfo?.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icons.twitter className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            )}
            <div>
                <Separator />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {images?.map((image) => (
                    <HoverCard key={image.id}>
                        <HoverCardTrigger asChild>
                            <div
                                className={` rounded-lg  overflow-hidden relative`}
                            >
                                <Link
                                    href={`/i/${image.id}`}
                                    className={`rounded-lg  overflow-hidden`}
                                >
                                    <Image
                                        unoptimized
                                        alt={image.generation.prompt}
                                        height={512}
                                        width={512}
                                        src={image.pixelatedImage}
                                    />
                                </Link>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <p className="text-sm text-primary">
                                {image.generation.prompt}
                            </p>
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>
            <Alert className="mt-6">
                <Icons.terminal className="h-4 w-4" />
                <AlertTitle>Do not see the style you want?</AlertTitle>
                <AlertDescription>
                    We are always adding more models. If there is a style you
                    want to see on the site please reach out on Twitter
                    @dparksdev.
                </AlertDescription>
            </Alert>
        </DashboardShell>
    )
}
