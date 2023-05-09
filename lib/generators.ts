export type TScenarioModels =
    | "fantasyRpg"
    | "landscapePortrait"
    | "animeStyle"
    | "pixelPortrait"
    | "skillArt"

type TScenarioModelsToIds = {
    [key in TScenarioModels]: string
}

export const scenarioGenerators: TScenarioModelsToIds = {
    fantasyRpg: "DkCC2BfCQ8mhxnyFW1tXcw",
    landscapePortrait: "BnhDXzIrQxWk1c0bWe73_w",
    animeStyle: "PNqixjKURbiouk49_gYWCw",
    pixelPortrait: "Zk4dmsnVQJ6x02F9IZfXhA",
    skillArt: "VB8yd1LaRsinkQMZuFoupg",
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
}

export const supplementalPromptMap = {
    DkCC2BfCQ8mhxnyFW1tXcw: " , fantasy RPG style, concept art",
    BnhDXzIrQxWk1c0bWe73_w: " , landscape portrait, ",
    PNqixjKURbiouk49_gYWCw: " , anime style",
    Zk4dmsnVQJ6x02F9IZfXhA:
        " , game icon, 16x16, pixel art, close up, portrait",
    VB8yd1LaRsinkQMZuFoupg:
        " , game icon, 32x32 pixel art, sRGB, skill art, close up, portrait",
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
