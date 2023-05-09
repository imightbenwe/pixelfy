"use client"

import { GuidanceSelector } from "../guidance-selector"
import { SamplingStepSelector } from "../sampling-step-selector"
import { Textarea } from "../ui/textarea"
import { Icons } from "@/components/icons"
import { ImageLoadingCard } from "@/components/image-loading-card"
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
import { downloadImage } from "@/lib/client-helpers"
import {
    normalizedGeneratorMap,
    scenarioGenerators,
    sizeLockedGenerators,
    sizeLockedGeneratorsSizeValue,
} from "@/lib/generators"
import { cn, convertBase64 } from "@/lib/utils"
import { generateSchema } from "@/lib/validations/generate"
import {
    ScenarioImage,
    ScenarioInferenceProgressResponse,
    ScenarioInferenceResponse,
} from "@/types/scenario"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id" | "name" | "credits">
}

type FormData = z.infer<typeof generateSchema>

export function GenerationForm({
    user,
    className,
    ...props
}: UserNameFormProps) {
    const router = useRouter()
    const {
        setValue,
        getValues,
        handleSubmit,
        register,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(generateSchema),
        defaultValues: {
            prompt: "",
        },
    })

    const reactivePrompt = watch("prompt")

    const [images, setImages] = React.useState<ScenarioImage[]>([])
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [promptGenerating, setPromptGenerating] =
        React.useState<boolean>(false)
    const [isOpen, setIsOpen] = React.useState<boolean>(true)
    const [showAdvancedOptions, setShowAdvancedOptions] =
        React.useState<boolean>(false)
    const [progress, setProgress] = React.useState<number>(0)
    const [modelId, setModelId] = React.useState<string>(
        scenarioGenerators.fantasyRpg
    )
    const [gridSize, setGridSize] = React.useState<string>("8")
    const [numImages, setNumImages] = React.useState<string>("4")

    const [samplingSteps, setSamplingSteps] = React.useState<number[]>([50])
    const [guidance, setGuidance] = React.useState<number[]>([7])

    const [referenceImage, setReferenceImage] = React.useState<any>(null)

    const generatePrompt = async (e: any) => {
        e.preventDefault()
        setPromptGenerating(true)

        const prompt = `
        Generate a comma-separated single sentence prompt that will be used to create an image. Include interesting visual descriptors and art styles. Make sure the prompt is less than 500 characters total, including spaces, newline characters punctuation. Do not include quotations in the prompt or the word "generate" or the word "ai". Do not use complete sentences. Please separate all descriptors with commas.
    
        Base the entire prompt on this context: ${getValues(
            "prompt"
        )} making sure to keep the style in mind which is: ${
            normalizedGeneratorMap[modelId]
        }`

        const response = await fetch("/api/generate/prompt-generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        })

        if (!response.ok) {
            if (response.status === 429) {
                return toast({
                    title: "Too many requests",
                    description:
                        "You have gone over your limit for requests to generate prompts. Try again in a second.",
                    variant: "destructive",
                })
            } else {
                throw new Error(response.statusText)
            }
        }

        // This data is a ReadableStream
        const data = response.body
        if (!data) {
            return
        }

        const reader = data.getReader()
        const decoder = new TextDecoder()
        let done = false
        setValue("prompt", "")

        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            const chunkValue = decoder.decode(value)
            setValue("prompt", getValues("prompt") + chunkValue)
        }
        setPromptGenerating(false)
    }

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(
            `
                /api/generate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    parameters: {
                        pixelSize: parseInt(gridSize),
                        modelId,
                        prompt: data.prompt,
                        samplingSteps: samplingSteps[0],
                        guidance: guidance[0],
                        numImages: parseInt(numImages),
                        referenceImage,
                    },
                }),
            }
        )

        if (!response?.ok && response.status === 402) {
            setIsSaving(false)
            return toast({
                title: "You are out of credits",
                description:
                    "In order to continue generating images please purchase more credits. If there's been a mistake contact support.",
                variant: "destructive",
            })
        } else if (!response.ok) {
            setIsSaving(false)
            return toast({
                title: "Something went wrong",
                description:
                    "Please try to generate your image again. If the issue persists contact support.",
                variant: "destructive",
            })
        }

        toast({
            title: "We've started your generation!",
            description:
                "This may take a few minutes. Don't worry, if it fails you will not be charged credits.",
            variant: "default",
        })

        const responseData: ScenarioInferenceResponse = await response.json()

        let generatedImages: null | ScenarioImage[] = null
        let secondCount = 0
        let showedPatienceModal = false
        while (!generatedImages) {
            // Loop in 1s intervals until the alt text is ready
            let finalResponse = await fetch(
                `/api/generate/${responseData.inference.id}?modelId=${modelId}`,
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

            if (jsonFinalResponse.inference.status === "succeeded") {
                generatedImages = jsonFinalResponse.inference.images
                setImages(generatedImages)
            } else if (jsonFinalResponse.inference.status === "failed") {
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
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
        }
        setIsSaving(false)
        router.refresh()
    }

    const sizeGridLocked = sizeLockedGenerators.includes(modelId)

    const userOutOfCredits = parseInt(numImages) / 4 > user?.credits

    return (
        <>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                    >
                        <form
                            className={cn(className)}
                            onSubmit={handleSubmit(onSubmit)}
                            {...props}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex w-full justify-between items-center">
                                        Create Images
                                    </CardTitle>

                                    <CardDescription>
                                        Enter a prompt for a series of images
                                        you would like to create
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-8">
                                        <div>
                                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 w-full">
                                                <div className="w-full lg:col-span-2">
                                                    <Label htmlFor="name">
                                                        Style
                                                    </Label>
                                                    <div className="flex items-baseline gap-4 mt-1 w-full">
                                                        <Select
                                                            value={modelId}
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                if (
                                                                    sizeLockedGenerators.includes(
                                                                        e
                                                                    )
                                                                ) {
                                                                    setGridSize(
                                                                        sizeLockedGeneratorsSizeValue[
                                                                            e
                                                                        ]?.toString()
                                                                    )
                                                                }
                                                                setModelId(e)
                                                            }}
                                                            defaultValue={
                                                                scenarioGenerators.fantasyRpg
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full lg:max-w-sm">
                                                                <SelectValue placeholder="Select a generator" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>
                                                                        Style
                                                                    </SelectLabel>

                                                                    {Object.keys(
                                                                        scenarioGenerators
                                                                    ).map(
                                                                        (
                                                                            key
                                                                        ) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    key={
                                                                                        key
                                                                                    }
                                                                                    value={
                                                                                        scenarioGenerators[
                                                                                            key as keyof typeof scenarioGenerators
                                                                                        ]
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        normalizedGeneratorMap[
                                                                                            scenarioGenerators[
                                                                                                key
                                                                                            ]
                                                                                        ]
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        }
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="name">
                                                        Number of images
                                                    </Label>
                                                    <div className="flex items-baseline gap-4 mt-1">
                                                        <Select
                                                            value={numImages}
                                                            onValueChange={
                                                                setNumImages
                                                            }
                                                            defaultValue={"4"}
                                                        >
                                                            <SelectTrigger className="w-full lg:w-[114px]">
                                                                <SelectValue placeholder="Select a generator" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem
                                                                        value={
                                                                            "4"
                                                                        }
                                                                    >
                                                                        4
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "8"
                                                                        }
                                                                    >
                                                                        8
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "12"
                                                                        }
                                                                    >
                                                                        12
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "16"
                                                                        }
                                                                    >
                                                                        16
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="name">
                                                        Grid size
                                                    </Label>
                                                    <div className="flex items-baseline gap-4 mt-1">
                                                        <Select
                                                            disabled={
                                                                sizeGridLocked
                                                            }
                                                            value={gridSize}
                                                            onValueChange={
                                                                setGridSize
                                                            }
                                                            defaultValue={"8"}
                                                        >
                                                            <SelectTrigger className="w-full lg:w-[114px]">
                                                                <SelectValue placeholder="Select a generator" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem
                                                                        value={
                                                                            "32"
                                                                        }
                                                                    >
                                                                        16x16
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "16"
                                                                        }
                                                                    >
                                                                        32x32
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "8"
                                                                        }
                                                                    >
                                                                        64x64
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            "4"
                                                                        }
                                                                    >
                                                                        128x128
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid w-full lg:max-w-sm items-center gap-1.5 mt-8">
                                                <Label htmlFor="picture">
                                                    Reference image (optional)
                                                </Label>
                                                <Input
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        if (e?.target?.files) {
                                                            const file =
                                                                e.target
                                                                    .files[0]

                                                            const base64 =
                                                                await convertBase64(
                                                                    file
                                                                )

                                                            setReferenceImage(
                                                                base64
                                                            )
                                                        }
                                                    }}
                                                    id="picture"
                                                    type="file"
                                                />
                                            </div>
                                            <div className="grid gap-1 mt-8 lg:mt-8 relative">
                                                <Label htmlFor="name">
                                                    Prompt
                                                </Label>

                                                <Textarea
                                                    disabled={
                                                        isSaving ||
                                                        promptGenerating
                                                    }
                                                    placeholder="Ex. Ekko from league of legends, vivid colors, full body, portrait"
                                                    className="mt-1"
                                                    id="Prompt"
                                                    maxLength={500}
                                                    {...register("prompt")}
                                                />
                                                {errors?.prompt && (
                                                    <p className="px-1 text-xs text-red-600">
                                                        {errors.prompt.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col items-start w-full">
                                    <div className="flex flex-col items-start mb-10 w-full">
                                        <div className="flex flex-col items-start w-full">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            disabled={
                                                                getValues(
                                                                    "prompt"
                                                                ) === "" ||
                                                                promptGenerating
                                                            }
                                                            onClick={(e) =>
                                                                generatePrompt(
                                                                    e
                                                                )
                                                            }
                                                            className={cn(
                                                                "w-full lg:w-auto flex gap-2"
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {promptGenerating ? (
                                                                <Icons.spinner className=" h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Icons.terminal
                                                                    size={16}
                                                                />
                                                            )}
                                                            <span>
                                                                Run prompt
                                                                builder
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Takes a phrase or
                                                            word from your input
                                                            and builds a prompt
                                                            for you. Powered by
                                                            ChatGPT 3.5 Turbo.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {showAdvancedOptions && (
                                            <motion.div
                                                key="content"
                                                initial="collapsed"
                                                animate="open"
                                                exit="collapsed"
                                                className="w-full"
                                                variants={{
                                                    open: {
                                                        opacity: 1,
                                                        height: "auto",
                                                    },
                                                    collapsed: {
                                                        opacity: 0,
                                                        height: 0,
                                                    },
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: [0.04, 0.62, 0.23, 1],
                                                }}
                                            >
                                                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 w-full pb-8">
                                                    <SamplingStepSelector
                                                        value={samplingSteps}
                                                        onValueChange={
                                                            setSamplingSteps
                                                        }
                                                        defaultValue={[50]}
                                                    />
                                                    <GuidanceSelector
                                                        value={guidance}
                                                        onValueChange={
                                                            setGuidance
                                                        }
                                                        defaultValue={[7]}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Alert
                                        variant={
                                            userOutOfCredits
                                                ? "destructive"
                                                : "default"
                                        }
                                        className="mt-0"
                                    >
                                        <Icons.info className="h-4 w-4" />
                                        <AlertTitle>
                                            {userOutOfCredits
                                                ? "You have insufficient credits for this generation"
                                                : "Credit usage breakdown"}
                                        </AlertTitle>
                                        <AlertDescription>
                                            This generation will use{" "}
                                            <strong>
                                                {parseInt(numImages) / 4}{" "}
                                                {parseInt(numImages) / 4 !== 1
                                                    ? "credits"
                                                    : "credit"}{" "}
                                            </strong>
                                            once it succeeds. 1 credit = 4
                                            images.
                                        </AlertDescription>
                                    </Alert>
                                    <div className="flex flex-col lg:flex-row items-center gap-4 w-full mt-6">
                                        {userOutOfCredits ? (
                                            <Link
                                                className="w-full lg:w-auto"
                                                href="/credits"
                                            >
                                                <button
                                                    className={cn(
                                                        buttonVariants(),
                                                        className,
                                                        "w-full lg:w-auto"
                                                    )}
                                                >
                                                    <Icons.billing className="mr-2 h-4 w-4 " />
                                                    <span>
                                                        Buy more credits
                                                    </span>
                                                </button>
                                            </Link>
                                        ) : (
                                            <button
                                                disabled={
                                                    reactivePrompt === "" ||
                                                    isSaving ||
                                                    promptGenerating
                                                }
                                                type="submit"
                                                className={cn(
                                                    buttonVariants(),
                                                    className,
                                                    "w-full lg:w-auto"
                                                )}
                                            >
                                                {isSaving && (
                                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                <span>Generate</span>
                                            </button>
                                        )}

                                        <Button
                                            className={cn("w-full lg:w-auto")}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setShowAdvancedOptions(
                                                    !showAdvancedOptions
                                                )
                                            }}
                                            variant={"outline"}
                                        >
                                            Show advanced options
                                        </Button>
                                    </div>

                                    {/* </Alert>
                                    <Badge
                                        variant="outline"
                                        className="mt-4 inline-flex gap-1"
                                    >
                                        This generation will use{" "}
                                        <strong>
                                            {parseInt(numImages) / 4}{" "}
                                            {parseInt(numImages) / 4 !== 1
                                                ? "credits"
                                                : "credit"}{" "}
                                        </strong>
                                        once it succeeds. 1 credit = 4 images.
                                    </Badge> */}
                                </CardFooter>
                            </Card>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            {isSaving && (
                <>
                    <div className="mt-4">
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
                <div className="mt-4 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                        {images.map((image) => (
                            <div
                                key={image.seed}
                                className="rounded-lg overflow-hidden relative w-full"
                            >
                                {image?.pixelated && (
                                    <>
                                        <Image
                                            unoptimized
                                            className="object-cover w-full h-auto"
                                            height={512}
                                            width={512}
                                            alt={"Image prompt result"}
                                            src={image.pixelated}
                                        />
                                        <Button
                                            onClick={() =>
                                                downloadImage(
                                                    image.pixelated ?? "",
                                                    image.seed
                                                )
                                            }
                                            className="absolute top-4 right-4"
                                            variant="secondary"
                                        >
                                            <Icons.download className="h-4 w-4" />
                                        </Button>
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
