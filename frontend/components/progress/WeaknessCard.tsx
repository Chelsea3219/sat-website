import Link from "next/link"
import { CircleAlert } from "lucide-react"
import { SubtopicMastery } from "@/types/students"


type WeaknessProps = {
    cardTitleStyle: string
    weakSubtopicBreakdown: SubtopicMastery[] | undefined
}

export default function WeaknessCard({cardTitleStyle, weakSubtopicBreakdown}: WeaknessProps) {

    // Guard 
    if (!weakSubtopicBreakdown || weakSubtopicBreakdown.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <span className="text-2xl">🎉</span>
                <span className="text-slate-600 font-semibold">No weaknesses yet — keep practicing!</span>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full">
                <div className="flex flex-row space-x-2 items-center mb-2">
                    <CircleAlert style={{strokeWidth:2}} className="text-orange-500 w-6 h-6"/>
                    <p className={`text-orange-500 ${cardTitleStyle}`}>Weaknesess</p>
                </div>
                {weakSubtopicBreakdown?.map((sub) => (
                    <div key={sub.subtopic} className="flex flex-row justify-between items-center space-y ml-2">
                        <div className="flex flex-row space-x-1 items-center">
                            <Link
                                href={`/dashboard/practice/${sub.section}/${sub.topic}/${sub.subtopic}`}
                                className = "text-sm hover:text-orange-500 hover:font-bold cursor-pointer"
                            >
                                {sub.subtopic}
                            </Link>
                            <p className="text-xs text-orange-500 font-bold mt-1 uppercase">{sub.section.slice(0,1)}</p>
                        </div>
                        <div>
                            <p className=" text-xs font-semibold">{sub.mastery_score.mastery_score}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}