type ProgressProps = {
    satScore: number
    masteryScore: number // 0-100
    className?: string
    pointChange: number
}

export default function ProgressBarSemicircle({ satScore, masteryScore, className, pointChange}: ProgressProps) {
    const clampedScore = Math.max(0, Math.min(100, masteryScore))

    // A semicircle path from left (180°) to right (0°), going over the top.
    // Using a 100x55 box: center at (50, 50), radius 45.
    const radius = 45
    const cx = 50
    const cy = 50

    // Full semicircle arc length (half the circle's circumference)
    const arcLength = Math.PI * radius

    // How much of the arc should be filled, based on score
    const filledLength = (clampedScore / 100) * arcLength


    return (
        <div className={`relative w-full max-w-xs mx-auto ${className ?? ''}`}>
            <svg viewBox="0 0 100 55" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                </defs>

                {/* Background track — full semicircle, left to right over the top */}
                <path
                    d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                    fill="none"
                    stroke="#D6DBF5"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Progress fill — same path, only the filled portion drawn via dasharray */}
                <path
                    d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${filledLength} ${arcLength}`}
                    className="transition-[stroke-dasharray] duration-700 ease-out"
                />
            </svg>

            {/* Value text, centered under the arc */}
            <div className="absolute inset-x-0 top-16 text-center">
                <span className="text-5xl font-bold text-main block">{satScore}</span>
                <span className="text-sm font-semibold text-slate-600 block">{clampedScore}% Mastery</span>
                {pointChange > 0 
                    ? (
                        <span className="text-lg font-bold text-green-500 block">{pointChange} INCREASE</span>
                    ):(
                        <span className="text-lg font-bold text-red-500 block">{pointChange} DECREASE</span>
                )}
            
            </div>
        </div>
    )
}