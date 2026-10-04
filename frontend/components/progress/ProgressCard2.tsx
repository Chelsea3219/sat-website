type CardProps = {
    children: React.ReactNode
    className?: string          // sizing/layout of the card itself (flex-1, basis-0, w-full...)
    contentClassName?: string   // layout of what's inside (flex-row, items-center, gap...)
    color: string
    isLoading?: boolean
    style?: React.CSSProperties
}

export default function ProgressCard2({ children, className = "", contentClassName = "", color, isLoading, style }: CardProps) {
    return (
        <div
            className={`flex min-h-0 flex-col rounded-lg p-1 ${isLoading ? "border-2 animate-shine-progress" : ""} ${className}`}
            style={{
                borderColor: `var(--color-${color})`,
                backgroundColor: `color-mix(in srgb, var(--color-${color}) 40%, white)`,
                "--shine-color": `var(--color-${color})`,
                ...style,
            } as React.CSSProperties}
        >
            {!isLoading ? (
                <div className={`flex min-h-0 flex-1 flex-col rounded-lg bg-white p-2 ${contentClassName}`}>
                    {children}
                </div>
            ) : (
                <div className="flex-1" />
            )}
        </div>
    )
}