import { Generation, OutputImage } from "@prisma/client"

export interface ScenarioInferenceResponse {
    inference: Inference
}

export interface Inference {
    id: string
    userId: string
    ownerId: string
    authorId: string
    modelId: string
    createdAt: string
    parameters: Parameters
    status: string
    images: any[]
    imagesNumber: number
    displayPrompt: string
}

export interface Parameters {
    numSamples: number
    guidance: number
    numInferenceSteps: number
    enableSafetyCheck: boolean
    width: number
    height: number
    type: string
    prompt: string
    strength: number
}

export interface ScenarioInferenceProgressResponse {
    inference: ScenarioInferenceProgress
    outputImages: OutputImage[]
}

export interface ScenarioInferenceProgress {
    id: string
    userId: string
    ownerId: string
    authorId: string
    modelId: string
    createdAt: string
    parameters: Parameters
    status: string
    images: ScenarioImage[]
    imagesNumber: number
    progress: number
    displayPrompt: string
}

export interface ScenarioImage {
    id: string
    url: string
    seed: string
    pixelated?: string
}

export interface ScenarioPixelateResponse {
    asset: Asset
    image: string
}

export interface Asset {
    id: string
    mimeType: string
    type: Type
    ownerId: string
    authorId: string
    createdAt: string
    updatedAt: string
    privacy: string
    tags: any[]
    collectionIds: any[]
}

export interface Type {
    source: string
    parentId: string
    rootParentId: string
    kind: string
    pixelGridSize: number
}
