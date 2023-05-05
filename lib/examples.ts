import { TScenarioModels } from "./generators"

export type TImage = {
    url: string
    prompt: string
}

export type TExample = {
    images: TImage[]
    slug: string
    heading: string
}

export type TScenarioExamples = {
    [key in TScenarioModels]: TExample
}

export const examples: TScenarioExamples = {
    fantasyRpg: {
        slug: "fantasy-rpg",
        heading: "Fantasy RPG",
        images: [
            {
                url: "/examples/fantasyRpg/owl.png",
                prompt: "Wise owl character, bioshock infinite, steampunk, aetherpunk",
            },
            {
                url: "/examples/fantasyRpg/neo.png",
                prompt: "Neo in the matrix, cyberpunk, sci-fi, dystopian future",
            },
            {
                url: "/examples/fantasyRpg/illidan.png",
                prompt: "Illidan Stormrage from world of warcraft",
            },
            {
                url: "/examples/fantasyRpg/warhammer.png",
                prompt: "Warhammer 40k, Fantasy warrior",
            },
            {
                url: "/examples/fantasyRpg/lux.png",
                prompt: "Lux from League of Legends, fantasy, magic, mage, wizard",
            },
            {
                url: "/examples/fantasyRpg/vayne.png",
                prompt: "Vayne from League of Legends",
            },
            {
                url: "/examples/fantasyRpg/scrapyard.png",
                prompt: "A man in a scrapyard, cyberpunk",
            },
            {
                url: "/examples/fantasyRpg/lich-king.png",
                prompt: "The Lich King from World of Warcraft",
            },
            {
                url: "/examples/fantasyRpg/deathwing.png",
                prompt: "Deathwing from world of warcraft",
            },
            {
                url: "/examples/fantasyRpg/anduinn.png",
                prompt: "King Anduinn Wrynn from World of Warcraft",
            },
            {
                url: "/examples/fantasyRpg/ekko.png",
                prompt: "Ekko from League of Legends",
            },
            {
                url: "/examples/fantasyRpg/thrall.png",
                prompt: "Warchief Thrall from World of Warcraft, desolate",
            },
        ],
    },
    animeStyle: {
        slug: "anime-style",
        heading: "Anime Style",
        images: [
            {
                url: "/examples/animeStyle/anime.png",
                prompt: "Kitsune girl, anime style, cyberpunk",
            },
            {
                url: "/examples/animeStyle/anime-girl.png",
                prompt: "Warrior princess, anime style",
            },
            {
                url: "/examples/animeStyle/levi.png",
                prompt: "Levi Ackerman from Attack on Titan, anime style",
            },
            {
                url: "/examples/animeStyle/dbz.png",
                prompt: "Legendary Saiyan Broly in a fierce battle with Goku on a fiery planet.",
            },
            {
                url: "/examples/animeStyle/anime-boy-2.png",
                prompt: "Anime boy wearing armor, vivid colors",
            },
            {
                url: "/examples/animeStyle/hunter-x-hunter.png",
                prompt: "Hunter x hunter, Karupika, anime style",
            },
            {
                url: "/examples/animeStyle/demon-slayer-1.png",
                prompt: "Demon Slayer, anime style, vivid colors, full body, character portraite",
            },
            {
                url: "/examples/animeStyle/demon-slayer-2.png",
                prompt: "Demon Slayer, anime style, vivid colors, full body, character portraite",
            },
            {
                url: "/examples/animeStyle/demon-slayer-3.png",
                prompt: "Demon Slayer, anime style, vivid colors, full body, character portraite",
            },
            {
                url: "/examples/animeStyle/demon-slayer-4.png",
                prompt: "Demon Slayer, anime style, vivid colors, full body, character portraite",
            },
            {
                url: "/examples/animeStyle/fullmetal.png",
                prompt: "Fullmetal alchemist brotherhood, anime style, 16 bit",
            },
            {
                url: "/examples/animeStyle/fullmetal-2.png",
                prompt: "Fullmetal alchemist brotherhood, anime style, 16 bit",
            },
        ],
    },
    landscapePortrait: {
        slug: "landscape-portrait",
        heading: "Landscape Portrait",
        images: [
            {
                url: "/examples/landscapePortrait/tower.png",
                prompt: "A celestial tower in the sky, god like qualities, olympus, bright vivid colors",
            },
            {
                url: "/examples/landscapePortrait/farmhouse.png",
                prompt: "A farmhouse in a grassy valley, warm colors, cozy vibes, stardew valley",
            },
            {
                url: "/examples/landscapePortrait/gothic-1.png",
                prompt: "Gothic castle, castlevania, metroidvania, dark colors, cloudy",
            },
            {
                url: "/examples/landscapePortrait/gothic-2.png",
                prompt: "Gothic castle, castlevania, metroidvania, dark colors, cloudy",
            },
            {
                url: "/examples/landscapePortrait/gothic-3.png",
                prompt: "Gothic castle, castlevania, metroidvania, dark colors, cloudy",
            },
            {
                url: "/examples/landscapePortrait/gothic-4.png",
                prompt: "Gothic castle, castlevania, metroidvania, dark colors, cloudy",
            },
            {
                url: "/examples/landscapePortrait/horde-1.png",
                prompt: "A horde war camp, rough colors, cloudy, desolate",
            },
            {
                url: "/examples/landscapePortrait/horde-2.png",
                prompt: "A horde war camp, rough colors, cloudy, desolate",
            },
            {
                url: "/examples/landscapePortrait/horde-3.png",
                prompt: "A horde war camp, rough colors, cloudy, desolate",
            },
            {
                url: "/examples/landscapePortrait/horde-4.png",
                prompt: "A horde war camp, rough colors, cloudy, desolate",
            },
            {
                url: "/examples/landscapePortrait/bladerunner-1.png",
                prompt: "Blade runner city, cyberpunk, aetherpunk, cloudy, dark colors, neon lights",
            },
            {
                url: "/examples/landscapePortrait/bladerunner-2.png",
                prompt: "Blade runner city, cyberpunk, aetherpunk, cloudy, dark colors, neon lights",
            },
            {
                url: "/examples/landscapePortrait/bladerunner-3.png",
                prompt: "Blade runner city, cyberpunk, aetherpunk, cloudy, dark colors, neon lights",
            },
            {
                url: "/examples/landscapePortrait/bladerunner-4.png",
                prompt: "Blade runner city, cyberpunk, aetherpunk, cloudy, dark colors, neon lights",
            },
        ],
    },
    // "16x16Icons": {
    //     slug: "16bit-icons",
    //     heading: "16x16 Icons",
    //     images: [
    //         {
    //             url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/839f4818-8792-4872-ba97-e692d596d2d6.png",
    //             prompt: "Rainbow coin",
    //         },
    //         {
    //             url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/5b56a850-5bc6-44fc-b312-e95ea934b504.png",
    //             prompt: "Rainbow coin",
    //         },
    //         {
    //             url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/e3bc7d6e-bcc1-4f4c-95bd-4c6d2c920e2c.png",
    //             prompt: "Bag of rainbow coin",
    //         },
    //         {
    //             url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/411dabe3-22ea-4a54-87a3-3202ac1a9909.png",
    //             prompt: "Gold coin",
    //         },
    //     ],
    // },
    // shields: {
    //     slug: "32x32-shields",
    //     heading: "32x32 Shields",
    //     images: [
    //         {
    //             url: "/examples/shields/shield1.png",
    //             prompt: "Glowing blue shield",
    //         },
    //         {
    //             url: "/examples/shields/shield2.png",
    //             prompt: "Glowing blue shield",
    //         },
    //         {
    //             url: "/examples/shields/shield3.png",
    //             prompt: "Volcanic Shield",
    //         },
    //         {
    //             url: "/examples/shields/shield4.png",
    //             prompt: "A gleaming crystal shield reflects a fiery dragon's breath in a bold, stylized art nouveau illustration.",
    //         },
    //         {
    //             url: "/examples/shields/shield5.png",
    //             prompt: "A gleaming crystal shield reflects a fiery dragon's breath in a bold, stylized art nouveau illustration.",
    //         },
    //     ],
    // },
    pixelPortrait: {
        slug: "pixel-portrait",
        heading: "16x16 Pixel Portrait",
        images: [
            {
                url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/1a5319eb-9aa0-4914-82e5-71744b646df8.png",
                prompt: "Sleek, shadowy spy",
            },
            {
                url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/a276fe8e-ae0a-40a2-abb6-4a54d019fad1.png",
                prompt: "Sleek, shadowy spy",
            },
            {
                url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/bf1d608e-0bb0-472d-bcd2-221b137204d9.png",
                prompt: "Robot",
            },
            {
                url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/fbd21463-8c5e-459d-8f49-467056984b73.png",
                prompt: "Robot",
            },
            {
                url: "https://jpxwqgklwwytoznbpbmn.supabase.co/storage/v1/object/public/pixelated/859e49fc-1978-4e70-8487-149163050871.png",
                prompt: "Robot",
            },
            {
                url: "/energy.png",
                prompt: "otherworldly avatar with glowing eyes, metallic armor, and flowing tendrils of neon energy surrounding their ethereal form",
            },
            {
                url: "/examples/pixelPortrait/energy-2.png",
                prompt: "otherworldly avatar with glowing eyes, metallic armor, and flowing tendrils of neon energy surrounding their ethereal form",
            },
            {
                url: "/examples/pixelPortrait/energy-3.png",
                prompt: "otherworldly avatar with glowing eyes, metallic armor, and flowing tendrils of neon energy surrounding their ethereal form",
            },
            {
                url: "/examples/pixelPortrait/energy-4.png",
                prompt: "otherworldly avatar with glowing eyes, metallic armor, and flowing tendrils of neon energy surrounding their ethereal form",
            },
        ],
    },
}
