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
    const rx = 48   // horizontal radius — bigger = wider
    const ry = 45   // vertical radius — smaller = flatter/shorter
    const cx = 50
    const cy = 55

    // Full semicircle arc length (half the circle's circumference)
    const arcLength = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))
    const filledLength = (clampedScore / 100) * arcLength


    return (
        <div className={`relative w-full max-w-xs mx-auto ${className ?? ''}`}>
            <svg viewBox="-6 0 112 60" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                </defs>

                {/* Background track — full semicircle, left to right over the top */}
                <path
                    d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
                    fill="none"
                    stroke="#D6DBF5"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                <path
                    d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${filledLength} ${arcLength}`}
                    className="transition-[stroke-dasharray] duration-700 ease-out"
                />
            </svg>

            {/* Value text, centered under the arc */}
            <div className="absolute inset-x-0 top-14 text-center">
                <span className="text-5xl font-bold text-main block">{satScore}</span>
                <span className="text-sm font-semibold text-slate-600 block">{clampedScore}% Mastery</span>
                {pointChange == null ? null : pointChange > 0 ?  (
                    <span className="text-lg font-bold text-green-500 block">+{pointChange}</span>
                ) : pointChange < 0 ? (
                    <span className="text-lg font-bold text-red-500 block">-{pointChange}</span>
                ) : (
                    <p></p>
                )}
            
            </div>
        </div>
    )
}