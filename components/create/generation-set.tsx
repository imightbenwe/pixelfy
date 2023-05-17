"use client"

import { GuidanceSelector } from "../guidance-selector"
import { SamplingStepSelector } from "../sampling-step-selector"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { Icons } from "@/components/icons"
import { ImageInfluencerSlider } from "@/components/image-influence-slider"
import { ImageLoadingCard } from "@/components/image-loading-card"
import { ImageOptions } from "@/components/image-options"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
    sizeDisabledGenerators,
    scenarioGenerators,
    supplementalPromptMap,
    sizeLockedGenerators,
    sizeLockedGeneratorsSizeValue,
    scenarioModelData,
} from "@/lib/generators"
import { cn, convertBase64 } from "@/lib/utils"
import { generateSchema } from "@/lib/validations/generate"
import {
    ScenarioInferenceProgressResponse,
    ScenarioInferenceResponse,
} from "@/types/scenario"
import { zodResolver } from "@hookform/resolvers/zod"
import { OutputImage, User } from "@prisma/client"
import va from "@vercel/analytics"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export interface IGenerationSet {
    inferenceId: string
    modelId: string
    numImages: string
    prompt: string
}

export const GenerationSet = ({
    inferenceId,
    modelId,
    numImages,
}: IGenerationSet) => {
    const router = useRouter()

    const [images, setImages] = React.useState<OutputImage[]>([])
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [progress, setProgress] = React.useState<number>(0)

    React.useEffect(() => {
        if (!inferenceId || !modelId) return

        const pollGeneration = async () => {
            try {
                let generatedImages: null | OutputImage[] = null
                let secondCount = 0
                let showedPatienceModal = false
                setIsSaving(true)
                while (!generatedImages) {
                    // Loop in 1s intervals until the alt text is ready
                    let finalResponse = await fetch(
                        `/api/generate/${inferenceId}?modelId=${modelId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    let jsonFinalResponse: ScenarioInferenceProgressResponse =
                        await finalResponse.json()
                    setProgress(jsonFinalResponse.inference.progress)

                    if (
                        jsonFinalResponse.inference.status === "succeeded" &&
                        jsonFinalResponse?.outputImages
                    ) {
                        generatedImages = jsonFinalResponse.outputImages
                        setImages(generatedImages)
                    } else if (
                        jsonFinalResponse.inference.status === "failed"
                    ) {
                        break
                    } else {
                        if (secondCount >= 60 && !showedPatienceModal) {
                            toast({
                                title: "Still generating!",
                                description:
                                    "Sorry this is taking a while. Your generation should be done soon. Thanks for your patience",
                                variant: "default",
                            })
                            showedPatienceModal = true
                        }
                        secondCount++
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        )
                    }
                }
                setIsSaving(false)
                router.refresh()
            } catch (e) {
                console.log(e)
            }
        }

        pollGeneration()
    }, [inferenceId, modelId])

    return (
        <>
            {isSaving && (
                <>
                    <div className="mt-0">
                        <Progress value={progress * 100} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
                        {Array.from(Array(parseInt(numImages)), (e, i) => {
                            return <ImageLoadingCard key={i} />
                        })}
                    </div>
                </>
            )}

            {images && (
                <div className="mt-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full mt-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="rounded-lg overflow-hidden relative w-full"
                            >
                                {image?.pixelatedImage && (
                                    <>
                                        <Image
                                            unoptimized
                                            className="object-cover w-full h-auto"
                                            height={512}
                                            width={512}
                                            alt={"Image prompt result"}
                                            src={image.pixelatedImage}
                                        />
                                        <div className="absolute top-2 right-2 z-10">
                                            <ImageOptions
                                                name={image.seed}
                                                imageId={image.id}
                                                src={image.pixelatedImage}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
