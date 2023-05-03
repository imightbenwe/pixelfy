import { DashboardShell } from "@/components/shell"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingImage() {
    return (
        <DashboardShell>
            <div className="container mx-auto w-full flex flex-col items-center justify-center dark:bg-transparent mt-16">
                <div className="w-full flex mx-auto max-w-[512px] max-h-[512px] overflow-hidden relative">
                    <AspectRatio ratio={1 / 1}>
                        <Skeleton className="h-full w-full flex items-center justify-center rounded-lg overflow-hidden relative"></Skeleton>
                    </AspectRatio>
                </div>
            </div>
        </DashboardShell>
    )
}
