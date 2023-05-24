interface IStats {
    stats: {
        name: string
        value: number
        unit?: string
    }[]
}

export function Stats({ stats }: IStats) {
    return (
        <div>
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-4 bg-background sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg"
                        >
                            <p className="text-sm font-medium leading-6 text-muted-foreground">
                                {stat.name}
                            </p>
                            <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-brand">
                                    {stat.value}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
