

type ProgressCircleProps = {
    color: string
    masteryScore: number 
    label: string
    className: string 
}

export default function ProgressCircle({color, masteryScore,className, label}:ProgressCircleProps) {
    const score = Math.min(100, Math.max(0, masteryScore))
    const strokeColor = `var(--color-${color})`

    return (
        <div className = {`flex justify-center ${className}`}>
            <div className="relative size-40">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    {/* Background circle */}
                    <circle 
                        cx="18" cy="18" r="16" 
                        fill="none" 
                        className="stroke-current text-foreground/10" 
                        strokeWidth="3"
                    ></circle>
                    {/* Progress circle */}
                    <circle 
                        cx="18" cy="18" r="16"
                        fill="none" 
                        className="transition-[stroke-dashoffset] duration-700 ease-out"
                        stroke = {strokeColor}
                        strokeWidth="3"
                        pathLength="100"
                        strokeDasharray="100" 
                        strokeDashoffset={100-score}
                        strokeLinecap="round"
                    ></circle>
                </svg>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-main/80 tabular-nums">{Math.round(score)}%</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
                </div>
            </div>
        </div>
    )
}