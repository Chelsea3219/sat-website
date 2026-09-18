import { estimateSATSectionScore2 } from "@/utils/scoreAlgorithms"

type MasteryScoresProps = {
    title: string
    sectionMastery: number
    scores: Record<string, number>
}


// Returns a color based on masteryScore
const getBarColor = (score: number) => {
    if (score < 30) return '#E24B4A'  // weakness — red
    if (score <60) return '#f59e0b'  // orange
    if (score <80) return '#FFEA00'  // yellow
    if (score > 81) return '#1D9E75'  // strength — green
    return 'var(--color-accent)'
}
    

export default function TopicMasteryChart({scores, title, sectionMastery}: MasteryScoresProps) {

    return (
        <>
            <div className="w-full">
                {/* Title */}
                <div className="flex flex-row justify-between">
                    <p className="uppercase text-xl text-gray-600 font-bold">{title}</p>
                    <div className="flex flex-row gap-2 rounded-xl px-4 py-2 border-4 border-primary font-semibold text-center">
                        <p className=" text-primary">{sectionMastery}%</p>
                        <p className="border-l-5 border-primary"></p>
                        <p className=" text-primary">{estimateSATSectionScore2(sectionMastery)}</p>
                    </div>
                </div>


                {/* map function is an array method. So you need to convert scores to an array of entries using Object.entries() */}
                {Object.entries(scores).map(([label, score]) => (
                    <div key={label} className="flex flex-col mb-2">
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
                                style={{ width: `${score}%`, backgroundColor: getBarColor(score)}}
                            />
                        </div>
                    </div>
                ))}
            </div>

        
        </>
    )
}