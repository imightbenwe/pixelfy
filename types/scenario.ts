import { Generation, OutputImage } from "@prisma/client"

export interface ScenarioInferenceResponse {
    inference: Inference
    job: Job
}

export interface Job {
    jobId: string
    jobType: string
    metadata: JobMetadata
    ownerId: string
    authorId: string
    createdAt: string
    updatedAt: string
    status: string
    statusHistory: StatusHistoryItem[]
    progress: number
}

export interface JobMetadata {
    baseModelId: string
    inferenceId: string
    input: any // You might want to type this more specifically
    modelId: string
    modelType: string
    priority: number
    assetIds: string[]
}

export interface StatusHistoryItem {
    // Add specific fields based on your needs
    status?: string
    timestamp?: string
}

export interface Inference {
    id: string
    userId: string
    ownerId: string
    authorId: string
    modelId: string
    createdAt: string
    parameters: InferenceParameters
    status: string
    images: ScenarioImage[]
    imagesNumber: number
    displayPrompt: string
}

export interface InferenceParameters {
    numSamples: number
    guidance: number
    numInferenceSteps: number
    width: number
    height: number
    type: string
    prompt: string
    negativePrompt?: string
    strength?: number
    modality?: string
    image?: string
}

export interface InferenceImage {
    id: string
    url: string
    seed: string
    pixelated?: string
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
    parameters: InferenceParameters
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
