import { DashboardHeader } from "@/components/header"
import { ImageLoadingCard } from "@/components/image-loading-card"
import { SearchGenerationsInput } from "@/components/search-generations-input"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSettingsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Generations"
                text="View all of your generations here"
            >
                <SearchGenerationsInput />
            </DashboardHeader>
        </DashboardShell>
    )
}
