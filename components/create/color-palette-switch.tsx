"use client"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { useColorStore } from "@/store"
import { Plus } from "lucide-react"
import { useState } from "react"
import { HexColorPicker } from "react-colorful"

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return [r, g, b]
}

interface IPalettePopover {
    colorProp?: string
}
export function PalettePopover({ colorProp = "#aabbcc" }: IPalettePopover) {
    const { addColor } = useColorStore()
    const [color, setColor] = useState<string>(colorProp)
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-10 rounded-full p-0">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Open popover</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4 responsive">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            Add color to palette
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Choose a color from the palette or enter a hex code
                        </p>
                    </div>
                    <HexColorPicker
                        className="w-full responsive"
                        color={color}
                        onChange={setColor}
                    />
                    <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <div className="flex items-center gap-2 w-full">
                        <Button
                            onClick={() => {
                                addColor(hex2rgb(color))
                            }}
                            className="w-full"
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

interface IColorPaletteSwitch {
    gridSize: string
}
export function ColorPaletteSwitch({ gridSize }: IColorPaletteSwitch) {
    const { colors, colorPaletteEnabled, toggleColorPalette, removeColor } =
        useColorStore()

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-2">
                <Switch
                    disabled={gridSize === "32"}
                    onCheckedChange={(e) => {
                        toggleColorPalette()
                    }}
                    checked={colorPaletteEnabled}
                    id="airplane-mode"
                />
                <div className="flex flex-col">
                    <Label htmlFor="airplane-mode">Custom color palette</Label>
                </div>
            </div>

            {colorPaletteEnabled && (
                <div className="mt-4 flex items-center flex-wrap gap-1">
                    {colors.map((color, index) => (
                        <div
                            className="h-8 w-8 rounded-md group relative"
                            style={{
                                backgroundColor: `rgb(${color.join(",")})`,
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    removeColor(index)
                                }}
                                className="group-hover:flex items-center justify-center hidden absolute inset-0 opacity-50 rounded-md text-primary-foreground"
                            >
                                <Icons.close />
                            </button>
                        </div>
                    ))}
                    <PalettePopover />
                </div>
            )}
        </div>
    )
}
