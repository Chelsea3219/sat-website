
import { PracticeGradedResponse } from "@/types/mastery-score"
import { SubtopicMastery } from "@/types/students"
import ProgressCircle from "../../ProgressCircle"
import { toTitleCase, normalizeText } from "@/utils/renderFormattedText"
import { colorChange } from "@/utils/renderColor"
import {ArrowUp, ArrowDown, CircleCheck, CircleX, Clock} from "lucide-react"
import { IconTargetArrow } from '@tabler/icons-react';

type PracticeResultsProp = {
    topic: string 
    subtopic: string
    practiceResults: PracticeGradedResponse
    pastSubtopicMastery: SubtopicMastery[]
}



export default function PracticeResults({topic, subtopic, practiceResults, pastSubtopicMastery}: PracticeResultsProp) {
    // Normalize the subtopics and sort the current sutopicBreakdown
    const normalizedSubtopic = normalizeText(subtopic)
    const subtopicBreakdown = Object.entries(practiceResults.subtopics)
        .filter(([sub]) => sub !== normalizedSubtopic)
        .sort(( [, a], [,b]) => a.current_subtopic_mastery.mastery_score.mastery_score - b.current_subtopic_mastery.mastery_score.mastery_score)

    // Question Statistics
    const selected = practiceResults.subtopics[normalizedSubtopic]
    const numQuestions = selected.current_subtopic_mastery.questions_answered.num_questions
    const numIncorrect = selected.current_subtopic_mastery.questions_answered.num_incorrect
    const numCorrect = numQuestions - numIncorrect

    // Past scores by subtopic for quick lookup
    const pastSubtopicBreakdown = new Map(pastSubtopicMastery.filter(record => record.topic === topic).map(record => [normalizeText(record.subtopic), record]))

    // Styles 
    const gridCols = "grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 items-center"
    const numberStyle = "flex justify-center text-sm tabular-nums"
    return (
        <>
            <div className="flex flex-col">
                {/* Practice Main Subtopic  */}
                <p className="text-main/80 text-3xl font-semibold">{toTitleCase(selected.current_subtopic_mastery.subtopic)}</p>
                
                {/* Main Subtopic and other subtopics breakdown  */}
                <div className="flex flex-row mt-6 gap-4 items-stretch w-full h-full">
                    
                    { /* Overall Score */ }
                    <div className="flex flex-1 shrink-0 flex-col border border-secondary rounded-xl p-2 gap-y-8">
                        { /* Title */ }
                        <div className="flex items-center flex-row gap-x-2">
                            <IconTargetArrow className="w-8 h-8 text-primary" strokeWidth={2}/>
                            <p className="uppercase text-lg font-bold tracking-wide text-main/70">Performance Summary</p>
                        </div>

                        { /* Progress */ }
                        <ProgressCircle 
                            color="accent" 
                            masteryScore={selected.current_subtopic_mastery.mastery_score.mastery_score} 
                            className="my-4" 
                            label="Mastery"
                        />

                        { /* NUmber of Correct and Incorrect Questions, Avg Time elapsed, Accuracy Rate */ }
                        <div className="flex justify-center">
                            <div className="grid grid-cols-3 w-3/4 divide-x divide-secondary border border-secondary bg-[#fafbfd] rounded-xl py-2">
                                {[
                                    { label: "Correct", value: numCorrect, Icon: CircleCheck, color: "green-500" }, 
                                    { label: "Incorrect", value: numIncorrect, Icon: CircleX, color: "red-500"},
                                    { label: "Avg Time", value: `${selected.current_subtopic_mastery.avg_time_elapsed}s`, Icon: Clock, color: "gray-500"}
                                ].map(({ label, value, Icon, color }) => (
                                    <div key={label} className="flex flex-1 flex-col items-center px-2 text-center">
                                        <Icon className="w-5 h-5" strokeWidth={2} style={{color : `var(--color-${color})`}}/>
                                        <p className="text-2xl font-bold text-primary">{value}</p>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    { /* Subtopic Score Breakdown */ }
                    <div className="flex flex-1 flex-col border border-secondary rounded-xl p-2">
                        <p className="uppercase text-lg font-bold tracking-wide text-main/70 mb-4">Subtopic Performance</p>

                        <div className={`${gridCols} border-b pb-1 mb-1 text-xs font-semibold uppercase tracking-wide text-main/50"`}>
                            {["Subtopic", "Past", "Current", "Updated"].map((name, i) => (
                                <p key={name} className={i > 0 ? "flex justify-center" : ""} >{name}</p>
                            ))}
                        </div>
                        <div className="divide-y divide-gray-100">
                            {subtopicBreakdown.map(( [sub, {current_subtopic_mastery, updated_subtopic_mastery}]) => {
                                const past = pastSubtopicBreakdown.get(normalizeText(sub))
                                const pastScore = past ? Math.round(past.mastery_score.mastery_score) : 0 
                                const currentScore = Math.round(current_subtopic_mastery.mastery_score.mastery_score)
                                const updatedScore = Math.round(updated_subtopic_mastery.mastery_score.mastery_score)
                                const arrowStyle = pastScore != null ? colorChange(currentScore, pastScore, "font-semibold") : "text-gray-400"
                                const deltaScore = pastScore != null ? currentScore - pastScore : 0
                                return (
                                    <div key={sub} className={`${gridCols} py-1`}>
                                        <p className="pl-3 -indent-3 text-sm ">{toTitleCase(sub)}</p>
                                        <p className={numberStyle}>{pastScore ?? "="}</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="w-3.5"/>
                                            <span className="text-sm tabular-nums">{currentScore}</span>
                                            <span>
                                                {deltaScore > 0 && <ArrowUp className={`h-3.5 w-3.5 ${arrowStyle}`} strokeWidth={3} />}
                                                {deltaScore < 0 && <ArrowDown className={`h-3.5 w-3.5 ${arrowStyle}`} strokeWidth={3} />}
                                            </span>
                                        </div>
                                        <p className={numberStyle}>{updatedScore}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}