export type TScenarioModels =
    | "fantasyRpg"
    | "landscapePortrait"
    | "animeStyle"
    | "pixelPortrait"
    | "skillArt"
    | "yoHokki"

type TArtistInfo = {
    instagram: string
    twitter: string
    name: string
    bio: string
}

export type TScenarioModelData = {
    id: string
    name: string
    description: string
    supplementalPrompt: string
    sizeLocked: boolean
    sizeLockedValue?: number
    slug: string
    examples?: string[]
    disabledSizes?: string[]
    featuredArtist?: boolean
    artistInfo?: TArtistInfo
}

export type TScenarioModelIdsToData = {
    [key in TScenarioModels]: TScenarioModelData
}

export type TScenarioModelsToIds = {
    [key in TScenarioModels]: string
}

export const scenarioModelData: TScenarioModelIdsToData = {
    fantasyRpg: {
        slug: "fantasy-rpg",
        id: "DkCC2BfCQ8mhxnyFW1tXcw",
        name: "Fantasy RPG",
        description: "Fantasy RPG style, concept art",
        supplementalPrompt: " , fantasy RPG style, concept art",
        sizeLocked: false,
        disabledSizes: ["32"],
        examples: [
            "clhfjtqv0002dugah4hstbwxk",
            "clh4bqrly0002mj0833sjle3k",
            "clh4bqrly0005mj08mowp8ucp",
            "clhe3o47b002nug7jui4y3ycz",
            "clhe3k5as0020ug7jnlk4dc98",
            "clh75lsko0003l3085itnesv9",
            "clh75lskp000al308u4tptx1t",
        ],
    },
    landscapePortrait: {
        slug: "landscape-portrait",
        id: "BnhDXzIrQxWk1c0bWe73_w",
        name: "Landscape Portrait",
        description: "Landscape Portrait Art for games",
        supplementalPrompt: " , landscape portrait, ",
        sizeLocked: false,
        disabledSizes: ["32"],
        examples: [
            "clh9qmtv80007mk08yj87qvyl",
            "clh9qmtv80009mk08f9kfbq8w",
            "clh9gwly4001uuglbw8024mrf",
            "clh7axjc50005mn08h16fursq",
            "clh5siqro0004mf084e6k1rqc",
            "clh3vjvg10011m8087a2p3vuo",
            "clh3yav9n0003mi0809524scl",
            "clh3yav9n0004mi08ewt2adhs",
        ],
    },
    animeStyle: {
        slug: "anime-style",
        id: "PNqixjKURbiouk49_gYWCw",
        name: "Anime Style",
        description: "Anime style portrait art",
        supplementalPrompt: " , anime style",
        sizeLocked: false,
        disabledSizes: ["32"],
        examples: [
            "clh2oa3tv0005ju08x1v40dbv",
            "clh2oa3tv0003ju08hqc6pgct",
            "clh3x7xkp000ykz084k8jihvd",
            "clh3x7xkp000wkz08mz1a0jwz",
            "clhe3tbtw003eug7jey6n44l7",
            "clh3v4qnt000em80868f8s85c",
            "clh3xcv7o0017kz08ss3kamhx",
            "clh3xcv7o0016kz083npuy0br",
            "clh3wxek50005kz08ks6s47uu",
        ],
    },
    pixelPortrait: {
        slug: "pixel-portrait",
        id: "Zk4dmsnVQJ6x02F9IZfXhA",
        name: "16x16 Pixel Portrait",
        description:
            "16x16 pixel art portraits for pixel art games or profile pictures",
        supplementalPrompt:
            " , game icon, 16x16, pixel art, close up, portrait",
        sizeLocked: true,
        examples: [
            "clhfsgbkw0011ugzvwt3kw67u",
            "clhfso3ui0004k008u9zx40c8",
            "clh9lyoil0003ju08fegnd1w8",
            "clh9lyoil0002ju083rd7z32r",
            "clhawqj880005l808ajamyq08",
            "clhft1zvo0001l708apq99s8l",
            "clhft1zvo0002l7086vdaew02",
            "clhb7rt3r0000l608ftdvgpio",
            "clhbn63ec0004jw08y8p3a4pt",
            "clh9lv0ue0005l708tcmytduw",
        ],
    },
    skillArt: {
        slug: "skill-art-32x32",
        id: "VB8yd1LaRsinkQMZuFoupg",
        name: "32x32 Skill Art",
        description: "32x32 Skill Art for pixel art games",
        supplementalPrompt:
            " , game icon, 32x32 pixel art, sRGB, skill art, close up, portrait",
        sizeLocked: true,
        examples: [
            "clhcinhwo0023ugvb79g649zs",
            "clhcinhwo0020ugvbaj072m6v",
            "clhcinhwo0023ugvb79g649zs",
            "clhe2dz19000fug7j8s1i41gc",
            "clhcim1d0001qugvbih92tady",
            "clhe3d8kz001iug7jvz1mit3c",
            "clhcj35z00003l30874uao0jh",
            "clhe4l8o7004aug7j8mbeu13m",
            "clhe4l8o70048ug7j29jo5odf",
            "clhe28tw50011ugor5iq1ylcl",
            "clhcjnou1000bl0088txiz3n8",
            "clhcii3i5000wugvb2soqinm3",
        ],
    },
    yoHokki: {
        slug: "yo-hokki-style-pixel-art",
        id: "Q36HbYy1T2WdsjkfQp3MoA",
        name: "Yo-Hokki Style Pixel Art",
        description:
            "Game icon, 32x32 pixel art, sRGB, skill art, close up, portrait",
        supplementalPrompt:
            " , anime style, character portrait, close up, pixel art",
        sizeLocked: false,
        featuredArtist: true,
        disabledSizes: ["32"],
        artistInfo: {
            twitter: "https://twitter.com/YoHokki",
            instagram: "https://www.instagram.com/yo_hokki",
            name: "Yo-Hokki",
            bio: "Yo-Hokki is an artist who specializes in pixel art and anime style portraits.",
        },
        examples: [
            "clhh0m05j000fugee9xb6poxl",
            "clhh0pohf000zugee9by2nm3y",
            "clhh0pohf000yugeegt66zcjp",
            "clhh0t8g60019ugee5frf9uok",
            "clhh0t8g6001bugee40q5lz9q",
            "clhh0t8g6001augeeob9wa02s",
            "clhflnu120071ugahc56xj3b5",
            "clhflnu12006zugahbilbc0t1",
            "clhfl4nln002wugah3d8vjo5h",
            "clhgznu8b0004ugeue9lxke49",
            "clhh0inwc0007ugee9bpjolt7",
            "clhh0inwc0005ugee5apecca2",
            "clhh2oioy0001i808fjqd62nc",
            "clhh2oioy000bi808yw2e8610",
            "clhh2oioy0008i808znlp7ayq",
            "clhh2oioy0005i808mqxql266",
        ],
    },
}

export const scenarioGenerators: TScenarioModelsToIds = {
    fantasyRpg: "DkCC2BfCQ8mhxnyFW1tXcw",
    landscapePortrait: "BnhDXzIrQxWk1c0bWe73_w",
    animeStyle: "PNqixjKURbiouk49_gYWCw",
    pixelPortrait: "Zk4dmsnVQJ6x02F9IZfXhA",
    skillArt: "VB8yd1LaRsinkQMZuFoupg",
    yoHokki: "Q36HbYy1T2WdsjkfQp3MoA",
}

type TNormalizedGeneratorNameMap = {
    [key in TScenarioModels]: string
}

export const normalizedGeneratorMap = {
    DkCC2BfCQ8mhxnyFW1tXcw: "Fantasy RPG",
    BnhDXzIrQxWk1c0bWe73_w: "Landscape Portrait",
    PNqixjKURbiouk49_gYWCw: "Anime Style",
    Zk4dmsnVQJ6x02F9IZfXhA: "16x16 Pixel Portrait",
    VB8yd1LaRsinkQMZuFoupg: "32x32 Skill Art",
    Q36HbYy1T2WdsjkfQp3MoA: "Yo-Hokki Style",
}

export const supplementalPromptMap = {
    DkCC2BfCQ8mhxnyFW1tXcw: "",
    BnhDXzIrQxWk1c0bWe73_w: " , landscape portrait, ",
    PNqixjKURbiouk49_gYWCw: " , anime style",
    Zk4dmsnVQJ6x02F9IZfXhA:
        " , game icon, 16x16, pixel art, close up, portrait",
    VB8yd1LaRsinkQMZuFoupg:
        " , game icon, 32x32 pixel art, sRGB, skill art, close up, portrait",
    Q36HbYy1T2WdsjkfQp3MoA:
        ", character portrait, close up, anime style, pixel art",
}

export const sizeLockedGenerators = [
    // scenarioGenerators["16x16Icons"],
    // scenarioGenerators.shields,
    scenarioGenerators.pixelPortrait,
    scenarioGenerators.skillArt,
]

export const sizeLockedGeneratorsSizeValue = {
    [scenarioGenerators.pixelPortrait]: 32,
    [scenarioGenerators.skillArt]: 16,
    // [scenarioGenerators["16x16Icons"]]: 32,
    // [scenarioGenerators.shields]: 16,
}

export const sizeDisabledGenerators = [
    scenarioGenerators.fantasyRpg,
    scenarioGenerators.animeStyle,
    scenarioGenerators.yoHokki,
    scenarioGenerators.landscapePortrait,
]
