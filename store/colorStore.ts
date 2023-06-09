import { create } from "zustand"

interface IssueSelectStore {
    colorPaletteEnabled: boolean
    colors: number[][]
    toggleColorPalette: () => void
    addColor: (color: number[]) => void
    removeColor: (index: number) => void
    disableColorPalette: () => void
}

export const useColorStore = create<IssueSelectStore>((set) => ({
    colorPaletteEnabled: false,
    colors: [],
    toggleColorPalette: () => {
        set((state) => ({
            colorPaletteEnabled: !state.colorPaletteEnabled,
        }))
    },
    disableColorPalette: () => {
        set(() => ({
            colorPaletteEnabled: false,
        }))
    },
    enableColorPalette: () => {
        set(() => ({
            colorPaletteEnabled: true,
        }))
    },
    addColor: (color: number[]) => {
        set((state) => ({
            colors: [...state.colors, color],
        }))
    },
    removeColor: (index: number) => {
        set((state) => ({
            colors: state.colors.filter((_, i) => i !== index) as number[][],
        }))
    },
}))
