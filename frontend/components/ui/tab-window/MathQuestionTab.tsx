import { Question } from "@/types/questions"
import ReadOnlyContent from "./helpers/ReadOnlyEditor"
import katex from 'katex'; 
import 'katex/dist/katex.min.css'
import { formatLatex } from "@/utils/formatLatex";


type QuestionTabProps = {
    currentQuestion: Question
    timeElapsed: number


}


export default function MathQuestionTab({currentQuestion, timeElapsed}:QuestionTabProps) {
    // Loading Animation
    if (!currentQuestion) return 

    // Format Time 
    const formatTime = (seconds:number) => {
        const min = Math.floor(seconds/60)
        const sec = seconds % 60
        return `${min}m ${sec.toString().padStart(2, "0")}s`
    }


    return (
        <>
            <div className="flex flex-col p-4 h-full">

                {/* Question ID and difficulty */}
                <div className="flex flex-row items-center justify-end gap-x-2">
                    <p className="italic text-sm text-slate-400">{currentQuestion.question_id}</p>
                    <p className="uppercase text-primary font-semibold text-lg">{currentQuestion.difficulty}</p>
                </div>

                {/* Question Text */}
                <ReadOnlyContent
                    key={currentQuestion.question_id}
                    content={currentQuestion.text}
                    className="font-medium text-lg leading-relaxed"
                />

                {/* Equation */}
                <div className="">
                    {currentQuestion.equation && (
                        <div
                            className="flex items-center justify-center text-xl p-1 font-bold"
                            dangerouslySetInnerHTML={{
                                __html: katex.renderToString(formatLatex(currentQuestion.equation), {
                                    throwOnError: false,
                                    displayMode: true,  // block/centered for equations
                                })
                            }}
                        />
                    )}
                </div>

                {/* Multiple Choice and Diagram */}
                <div className="">
                    {currentQuestion.diagram ? (
                        <div>
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>

                {/* */}
                <div className="">

                </div>

            </div>
        </>
    )
}