import { scenarioModelData } from "@/lib/generators"
import { DocsConfig } from "types"

const sideBarExamples = Object.values(scenarioModelData).map(
    ({ slug, name, examples }) => ({
        title: name,
        href: `/examples/${slug}`,
    })
)

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
            items: sideBarExamples,
        },
    ],
}
