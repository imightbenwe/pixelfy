"use client"

import { Button } from "./ui/button"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import va from "@vercel/analytics"
import * as React from "react"
import { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof Button>

export type TCopyLinkButton = ButtonProps & {
    url: string
}

export const CopyLinkButton = ({ url, ...props }: TCopyLinkButton) => {
    const [linkCopied, setLinkCopied] = React.useState<boolean>(false)

    const onClick = () => {
        va.track("copy-link-button-clicked", {
            url,
        })
        navigator.clipboard.writeText(url)
        toast({
            title: "Link copied!",
            description: "You can now paste it anywhere you want.",
        })
        setLinkCopied(true)
    }

    return (
        <Button onClick={onClick} {...props}>
            {linkCopied ? (
                <Icons.check className="w-4 h-4 mr-2" />
            ) : (
                <Icons.clipBoard className="w-4 h-4 mr-2" />
            )}
            {props.children}
        </Button>
    )
}
