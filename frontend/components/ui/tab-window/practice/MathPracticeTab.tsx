import {PracticeQuestionTabProps} from "@/types/questions"
import ReadOnlyContent from "@/components/ui/tab-window/helpers/ReadOnlyEditor"
import katex from 'katex'; 
import 'katex/dist/katex.min.css'
import { formatLatex } from "@/utils/latexHelpers";
import InputAnswer from "@/components/ui/tab-window/helpers/InputAnswer";
import Image from "next/image";
import HorizontalLoadingAnimation from "@/components/ui/loading-animation/HorizontalLoadingAnimation";



export default function MathPracticeTab({
    currentQuestion, nextQuestion, 
    answer, answerChangeAction, checkAnswerAction, isCorrect,
    timeElapsed, error
}:PracticeQuestionTabProps) {
    // Guard clause to handle the case when currentQuestion is null or undefined
    if (!currentQuestion) return <HorizontalLoadingAnimation text="Loading question..." />

    // Format Time 
    const formatTime = (seconds:number) => {
        const min = Math.floor(seconds/60)
        const sec = seconds % 60
        return `${min}m ${sec.toString().padStart(2, "0")}s`
    }

    const buttonStyle = `
        flex-1
        py-3 rounded-full text-2xl font-semibold shadow-lg
        hover:bg-accent hover:border-accent hover:text-white transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed                    
    `

    return (
        <>
            <div className="flex flex-col py-1 px-4 space-y-1">
                {!currentQuestion && 
                    <>
                        <HorizontalLoadingAnimation text="Loading Questions"/>
                    </>
                }

                {/* Question ID and difficulty */}
                <div className="flex flex-row items-center justify-end gap-x-2">
                    <p className="italic text-xs text-slate-400">{currentQuestion.question_id}</p>
                    <p className="uppercase text-primary font-semibold text-md">{currentQuestion.difficulty}</p>
                </div>

                {/* Question Text */}
                <ReadOnlyContent
                    key={currentQuestion.question_id}
                    content={currentQuestion.text}
                    className="font-medium text-lg leading-relaxed"
                />

                {/* Equation */}
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

                {/* Multiple Choice and Diagram */}
                <div
                    className={
                        currentQuestion.question_type === "free response" && currentQuestion.diagram
                            ? "flex flex-col w-full"
                            : "flex items-start w-full"
                    }
                >
                    {currentQuestion.diagram ? (
                        currentQuestion.question_type === "multiple choice" ? (
                            <>
                                {/* Multiple Choice */}
                                <div className="flex-1 min-w-0">
                                    <InputAnswer
                                        question={currentQuestion}
                                        answer={answer}
                                        fieldChangeAction={answerChangeAction}
                                        isCorrect={isCorrect}
                                    />
                                </div>

                                {/* Diagram */}
                                <div className="relative flex-1 h-72 min-w-0">
                                    <Image
                                        src={currentQuestion.diagram}
                                        alt="Question diagram"
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        onError={() =>
                                            console.log(
                                                "diagram failed to load",
                                                currentQuestion.diagram
                                            )
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Diagram */}
                                <div className="relative w-full h-72">
                                    <Image
                                        src={currentQuestion.diagram}
                                        alt="Question diagram"
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        onError={() =>
                                            console.log(
                                                "diagram failed to load",
                                                currentQuestion.diagram
                                            )
                                        }
                                    />
                                </div>

                                {/* Free Response Input */}
                                <div className="w-full">
                                    <InputAnswer
                                        question={currentQuestion}
                                        answer={answer}
                                        fieldChangeAction={answerChangeAction}
                                        isCorrect={isCorrect}
                                    />
                                </div>
                            </>
                        )
                    ) : (
                        <div className="w-full">
                            <InputAnswer
                                question={currentQuestion}
                                answer={answer}
                                fieldChangeAction={answerChangeAction}
                                isCorrect={isCorrect}
                            />
                        </div>
                    )}
                </div>

                {/* Hints */}
                <div className="cursor-pointer flex flex-col gap-3 mt-4 font-semibold text-primary hover:text-accent hover:font-bold">
                    HINTS
                </div>

                {/* Stopwatch and Submit Button */}
                <div className="sticky bottom-0 border-t py-4 bg-white">
                    <p className="flex justify-center text-red-700">{error}</p>
                    <div className="flex flex-row items-center gap-4 mt-2">
                        <button
                            className={`border-primary bg-primary text-white ${buttonStyle}`}
                            onClick={checkAnswerAction}
                            disabled={answer === ""}
                        >
                            SUBMIT
                        </button>

                        {/* Stopwatch */}
                        <div className="flex-1 text-xl font-semibold text-slate-900 text-center px-4 py-3 border-2 border-primary rounded-full">
                            Time: {formatTime(timeElapsed)}
                        </div>

                        <button
                            className={`border-secondary bg-secondary text-main ${buttonStyle}`}
                            onClick ={nextQuestion}
                            disabled={!isCorrect}
                            >
                            Next Question
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}