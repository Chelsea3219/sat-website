import { estimateSATSectionScore2 } from "@/utils/scoreAlgorithms"
import {LucideIcon} from "lucide-react"


type MasteryScoresProps = {
    title: string
    sectionMastery: number
    scores: Record<string, number>
    color: string
    Icon: LucideIcon
}


// Returns a color based on masteryScore
const getBarColor = (score: number, color:string) => {
    if (score < 30) return '#E24B4A'  // weakness — red
    if (score <60) return `var(--color-${color})`
    if (score <80) return '#F5B301'  // yellow
    return '#1D9E75'  // strength — green
}
    

export default function TopicMasteryChart({scores, Icon, title, sectionMastery, color}: MasteryScoresProps) {

    return (
        <>
            <div className="w-full">
                {/* Title */}
                <div className="flex flex-row flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-row gap-3 shrink-0 items-center">
                        <Icon style={{strokeWidth:2}} className="w-6 h-6 text-primary"/>
                        <p className="uppercase text-xl text-primary font-bold">{title}</p>
                    </div>
                    <div 
                        className="flex flex-row gap-2 rounded-2xl px-4 py-1 border-2 border-primary font-semibold text-center"
                        style={{ borderColor: `var(--color-${color})` } as React.CSSProperties}
                    >
                        <p style={{ color: `var(--color-${color})` } as React.CSSProperties} className="text-primary">{sectionMastery}%</p>
                        <p 
                            className="border-l-2"
                            style={{ borderColor: `var(--color-${color})` } as React.CSSProperties}
                        ></p>
                        <p style={{ color: `var(--color-${color})` } as React.CSSProperties} className="text-primary">{estimateSATSectionScore2(sectionMastery)}</p>
                    </div>
                </div>


                {/* map function is an array method. So you need to convert scores to an array of entries using Object.entries() */}
                {Object.entries(scores).map(([label, score]) => (
                    <div key={label} className="flex flex-col mb-1.5">
                        {/* Label row with score on the right */}
                        <div className="flex items-center justify-between gap-x-4">
                            <span className="text-md text-slate-600">{label}</span>
                            <span className="text-sm font-semibold text-main">{score}%</span>
                        </div>

                        {/* Bar track */}
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                            {/* Fill — width driven by score */}
                            <div
                                className="h-2 rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: `${score}%`, backgroundColor: getBarColor(score, color)}}
                            />
                        </div>
                    </div>
                ))}
            </div>

        
        </>
    )
}