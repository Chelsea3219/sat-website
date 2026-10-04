type CardProps = {
    children: React.ReactNode
    color: string
    bgColor?: string
    isLoading: boolean
    className?: string
    style?: React.CSSProperties
}


export default function DashboardCard({ children, className, style, color,bgColor, isLoading}: CardProps) {
// The chain of flex-1 flex flex-col through each nesting level makes the card stretch (each layers needs to both claims
    // its parent's full height (flex-1) and passes that height down to its children (flex flex-col))

    return (
        <div 
            className={`
                w-full h-full rounded-lg px-4 py-2 border-2 flex flex-row flex-1
                ${isLoading ? "animate-shine": ""}
            `}
            style={{ 
                borderColor: `var(--color-${color})`, 
                backgroundColor: `color-mix(in srgb, var(--color-${bgColor}) 10%, transparent)`,
                "--shine-color": `var(--color-${color})` , 
                ...style
            } as React.CSSProperties}
        >
            {!isLoading ?(
                <div className={` ${className}`}>{children}</div>
            ) : (
                <div></div>
            )}
        </div>
    )
}