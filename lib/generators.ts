export type TScenarioModels = "fantasyRpg" | "landscapePortrait" | "animeStyle"

type TScenarioModelsToIds = {
    [key in TScenarioModels]: string
}

export const scenarioGenerators: TScenarioModelsToIds = {
    fantasyRpg: "DkCC2BfCQ8mhxnyFW1tXcw",
    landscapePortrait: "BnhDXzIrQxWk1c0bWe73_w",
    animeStyle: "PNqixjKURbiouk49_gYWCw",
}

type TNormalizedGeneratorNameMap = {
    [key in TScenarioModels]: string
}

export const normalizedGeneratorMap = {
    DkCC2BfCQ8mhxnyFW1tXcw: "Fantasy RPG",
    BnhDXzIrQxWk1c0bWe73_w: "Landscape Portrait",
    PNqixjKURbiouk49_gYWCw: "Anime Style",
}
