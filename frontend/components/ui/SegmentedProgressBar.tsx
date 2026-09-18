
const masteryScoreToBar = (masteryScore: number): number => {
    // Calculate how many steps of (100/7) fit into the score
    const bar = Math.floor(masteryScore / (100 / 7));
    
    // Constrain the result between 0 and 7
    return Math.max(0, Math.min(7, bar));
};

type ProgressBarProps = {
    masteryScore: number
}
export const SegmentedProgressBar = ({masteryScore}: ProgressBarProps) => {

    const bars = masteryScoreToBar(masteryScore)

    return (
        <div className="flex gap-1">
            {Array.from({length:7}).map((_, index) => {
                const isFilled = index < bars
                return (
                    <div 
                        key={index} 
                        className={`h-3 w-12 border-2 ${
                            isFilled 
                                ? "bg-accent border-accent"
                                : "bg-white border-accent"
                        }`}
                    />
                )
            })}
        </div>
    )
}