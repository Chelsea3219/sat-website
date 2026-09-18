import {QuestionTabProps} from "@/types/questions"
import ReadOnlyContent from "./helpers/ReadOnlyEditor"
import katex from 'katex'; 
import 'katex/dist/katex.min.css'
import { formatLatex } from "@/utils/latexHelpers";
import InputAnswer from "./helpers/InputAnswer";
import Image from "next/image";
import HorizontalLoadingAnimation from "../loading-animation/HorizontalLoadingAnimation";


export default function MathQuestionTab({currentQuestion, answer, answerChangeAction, checkAnswerAction, timeElapsed, error}:QuestionTabProps) {
    // Guard clause to handle the case when currentQuestion is null or undefined
    if (!currentQuestion) return <HorizontalLoadingAnimation text="Loading question..." />

    // Format Time 
    const formatTime = (seconds:number) => {
        const min = Math.floor(seconds/60)
        const sec = seconds % 60
        return `${min}m ${sec.toString().padStart(2, "0")}s`
    }

    return (
        <>
            <div className="flex flex-col py-1 px-4 h-full space-y-1">
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
                            />
                        </div>
                    )}
                </div>

                {/* Hints */}
                <div className="cursor-pointer flex flex-col gap-3 mt-4 font-semibold text-primary hover:text-accent hover:font-bold">
                    HINTS
                </div>

                {/* Stopwatch and Submit Button */}
                <div className="mt-auto border-t py-4 bg-white">
                    <p className="flex justify-center text-red-700">{error}</p>
                    <div className="flex flex-row items-center gap-4 mt-2">
                        <div className="flex-1 text-xl font-semibold text-slate-900 text-center px-4 py-3 border-2 border-primary rounded-full">
                            Time: {formatTime(timeElapsed)}
                        </div>
                        {/* Stopwatch */}
                        <button
                            className=" flex-1
                                py-3 border-primary bg-primary rounded-full text-white text-2xl font-semibold shadow-lg
                                hover:bg-accent hover:border-accent hover:text-white transition-all duration-300
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                            onClick={checkAnswerAction}
                            // disabled={question.question_type ==="multiple choice" ? !selectedAnswer : freeResponse.trim() === ""}
                        >
                            SUBMIT
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}