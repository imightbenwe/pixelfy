import { ClassValue, clsx } from "clsx"
import Jimp from "jimp"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export type TPixelateImage = {
    remoteUrl: string
    pixelSize?: number
}

export async function pixelateImage({
    remoteUrl,
    pixelSize = 8,
}: TPixelateImage) {
    const imageFromScenario = await fetch(remoteUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${scenarioAuthToken}`,
        },
    }).then((res) => res.json())

    const image = await Jimp.read(imageFromScenario.asset.url).then((image) =>
        image.pixelate(pixelSize, 0, 0, 512, 512)
    )

    return image.getBase64Async(image.getMIME())
}

const scenarioToken = process.env.SCENARIO_API_TOKEN as string
const scenarioSecret = process.env.SCENARIO_SECRET as string

// export const scenarioAuthToken = `${btoa(`${scenarioToken}:${scenarioSecret}`)}`

export const scenarioAuthToken = Buffer.from(`${scenarioToken}:${scenarioSecret}`).toString("base64");

export function cleanSearchParams(urlSearchParams: URLSearchParams) {
    let cleanedParams = urlSearchParams
    let keysForDel = []

    urlSearchParams.forEach((value, key) => {
        if (value == "null" || value === "undefined" || !value) {
            // @ts-ignore
            keysForDel.push(key)
        }
    })

    keysForDel.forEach((key) => {
        cleanedParams.delete(key)
    })

    return cleanedParams
}

export function searchString(
    page: string | null | undefined,
    search: string | null | undefined,
    sort?: string | null | undefined
): string {
    // @ts-ignore
    const searchParameters = new URLSearchParams({
        page,
        search: encodeURIComponent(search ?? ""),
        sort,
    })

    return cleanSearchParams(searchParameters)?.toString()
}

export const convertBase64 = (file) =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
