import { Button } from "./ui/button"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link"
import * as React from "react"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn(className)}>
            <div className="container flex flex-col items-center justify-between gap-8 lg:gap-4 py-10 lg:h-24 lg:flex-row lg:py-0">
                <div>
                    <a
                        href="https://www.producthunt.com/products/pixelfy/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-pixelfy"
                        target="_blank"
                    >
                        <img
                            src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=532828&theme=neutral"
                            alt="Pixelfy - Generate&#0032;stunning&#0032;pixel&#0032;art&#0032;with&#0032;AI | Product Hunt"
                            style={{ width: "250px", height: "54px" }}
                            width="250"
                            height="54"
                        />
                    </a>
                </div>
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Icons.logo />
                    <p className="text-center text-sm leading-loose md:text-left">
                        Built by{" "}
                        <a
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            David Parks.
                        </a>{" "}
                        The source code is available on{" "}
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link href="/privacy-policy">
                        <Button variant="link">Privacy policy</Button>
                    </Link>
                    <Link href="/tos">
                        <Button variant="link">Terms of Service</Button>
                    </Link>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://twitter.com/Pixelfydotai"
                    >
                        <Icons.twitter />
                    </a>
                    <ModeToggle />
                </div>
            </div>
        </footer>
    )
}
