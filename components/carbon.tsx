"use client"

import { useEffect, useRef } from "react"

export const Carbon = () => {
    useEffect(() => {
        const script = document.createElement("script")
        const carbonContainer = document.getElementById("carbon-container")
        script.setAttribute("async", "true")
        script.setAttribute(
            "src",
            "//cdn.carbonads.com/carbon.js?serve=CWYDP5QM&placement=wwwpixelfyai"
        )
        script.setAttribute("id", "_carbonads_js")

        if (carbonContainer) {
            carbonContainer.appendChild(script)
        }

        return () => {
            if (carbonContainer) {
                carbonContainer.removeChild(script)
            }
        }
    }, [])
    return null
}
