type CardProps = {
    children: React.ReactNode
    className?: string 
}

export default function ProgressCard({ children, className}: CardProps) {
    // The chain of flex-1 flex flex-col through each nesting level makes the card stretch (each layers needs to both claims
    // its parent's full height (flex-1) and passes that height down to its children (flex flex-col))
    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-[#EEF1FF] rounded-2xl p-4 flex-1 flex flex-col">
                <div className={`bg-white rounded-2xl p-3 flex-1 flex flex-col items-center justify-center ${className ?? ''}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}