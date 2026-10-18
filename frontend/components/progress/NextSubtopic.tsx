import ProgressCard from "../progress/ProgressCard"
import { Compass } from "lucide-react"
import { SubtopicMastery } from "@/types/students"
import {toTitleCase} from "@/utils/renderFormattedText"
import Link from "next/link"



type Props = {
    cardTitleStyle: string
    nextSubtopic: SubtopicMastery | undefined 

}



export default function NextSubtopic({cardTitleStyle, nextSubtopic  }:Props){
    return (
        <>
            <div className="flex items-center gap-x-1 mb-4">
                <Compass style={{ strokeWidth: 2 }} className="w-6 h-6 text-primary shrink-0" />
                <p className={`text-primary ${cardTitleStyle}`}>Next Steps</p>
            </div>
            
            {nextSubtopic?.subtopic ? (
                <>
                    <div className="flex flex-col items-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Focus on</p>
                        <p className="text-2xl font-bold text-main text-center leading-tight">
                            {toTitleCase(nextSubtopic?.subtopic ?? "")}
                        </p>
                    </div>

                    <div className="hidden sm:block">
                        {[
                            {label:"Incorrect", value:nextSubtopic.questions_answered.num_incorrect}, 
                            {label:"Questions", value:nextSubtopic.questions_answered.num_questions}, 
                            {label:"Mastery", value:nextSubtopic?.mastery_score.mastery_score ?? ""}
                        ].map((item) => (
                            <div key={item.label} className="text-sm text-gray-500 flex flex-row justify-between">
                                <p>{item.label}</p>
                                <p>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href={`/dashboard/practice/${nextSubtopic?.section}/${nextSubtopic?.topic}/${nextSubtopic?.subtopic}`}
                        className="mt-2 sm:mt-4 w-full rounded-xl bg-primary py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 transition"
                    >
                        Practice Now
                    </Link>
                </>
            ) : (
                <>
                    <p className="text-center text-gray-500">No upcoming topics</p>
                    <Link
                        href="/dashboard/quiz"
                        className="mt-4 w-full rounded-xl bg-primary py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 transition"
                    >
                        Take a Quiz
                    </Link>
                </>
            )}
        </>
    )
}