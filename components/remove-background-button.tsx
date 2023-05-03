"use client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { downloadImage } from "@/lib/client-helpers"
import { ImageMinus } from "lucide-react"

interface IDownloadImageButton {
    imageId: string
    src: string
    name: string
}
export const RemoveBackgroundButton = ({
    src,
    name,
    imageId,
}: IDownloadImageButton) => {
    const removeImageBackground = async (e: any) => {
        e.preventDefault()

        const response = await fetch("/api/images/remove-background", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageId,
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
    }
    return (
        <Button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                removeImageBackground(e)
            }}
            size="sm"
            className="absolute top-16 right-4"
            variant="secondary"
        >
            <ImageMinus className="h-4 w-4" />
        </Button>
    )
}
