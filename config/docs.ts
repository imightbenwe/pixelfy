import { DocsConfig } from "types"

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Create",
            href: "/dashboard",
        },
    ],
    sidebarNav: [
        {
            title: "Styles",
            items: [
                {
                    title: "Fantasy RPG",
                    href: "/examples/fantasy-rpg",
                },
                {
                    title: "Anime Style",
                    href: "/examples/anime-style",
                },
                {
                    title: "Landscape Portrait",
                    href: "/examples/landscape-portrait",
                },
                {
                    title: "16x16 Pixel Portrait",
                    href: "/examples/pixel-portrait",
                },
                // {
                //     title: "32x32 Shields",
                //     href: "/examples/32x32-shields",
                // },
                // {
                //     title: "16x16 Icons",
                //     href: "/examples/16bit-icons",
                // },
            ],
        },
    ],
}
