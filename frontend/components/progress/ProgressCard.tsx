
type CardProps = {
    children: React.ReactNode
    color: string
    isLoading: boolean
    cardClassName?: string 
    className?: string
    style?: React.CSSProperties
}


export default function ProgressCard({ children, cardClassName, className, color, isLoading, style}: CardProps) {
    // The chain of flex-1 flex flex-col through each nesting level makes the card stretch (each layers needs to both claims
    // its parent's full height (flex-1) and passes that height down to its children (flex flex-col))

    return (
        <div 
            className={`
                w-full rounded-lg p-1 min-h-0 flex flex-1 flex-row ${cardClassName}
                ${isLoading ? "border-2 animate-shine-progress": ""}
                
            `}
            style={{ 
                borderColor: `var(--color-${color})` , 
                backgroundColor: `color-mix(in srgb, var(--color-${color}) 40%, white)`, 
                "--shine-color": `var(--color-${color})` , 
                ...style
            } as React.CSSProperties}
        >
            {!isLoading ?(
                <div className={`bg-white rounded-lg p-2 w-full h-full ${className}`}>{children}</div>
            ) : (
                <div className="flex-1"/>
            )}
        </div>
    )
}