import { Question} from "@/types/questions";
import "@/css/tab-window.css"
import "@/css/forms/form.css"
import {renderLatex} from "@/utils/latexHelpers";

type AnswerState = "default" | "selected" | "correct" | "incorrect" 

function getAnswerState(isSelected: boolean, isCorrect: boolean | null): AnswerState {
    if (!isSelected) return "default"
    if (isCorrect === true) return "correct"
    if (isCorrect === false) return "incorrect"
    return "selected"
}

const containerStyles: Record<AnswerState, string> = {
    default:   "border-slate-900",
    selected:  "border-primary border-3 font-bold",
    correct:   "border-green-500 border-3 bg-green-50 font-bold",
    incorrect: "border-red-500 border-3 bg-red-50 font-bold",
}

const circleStyles: Record<AnswerState, string> = {
    default:   "border-slate-900",
    selected:  "border-primary border-3 text-primary font-bold",
    correct:   "border-green-500 border-3 text-green-600 font-bold",
    incorrect: "border-red-500 border-3 text-red-600 font-bold",
}

const textStyles: Record<AnswerState, string> = {
    default:   "text-sm",
    selected:  "text-base text-primary font-bold",
    correct:   "text-base text-green-600 font-bold",
    incorrect: "text-base text-red-600 font-bold",
}

const inputStyles: Record<AnswerState, string> = {
    default:   "border-slate-900 font-bold",
    selected:  "border-primary border-3 text-base text-primary font-bold",
    correct:   "border-green-500 border-3 bg-green-50 text-base text-green-600 font-bold",
    incorrect: "border-red-500 border-3 bg-red-50 text-base text-red-600 font-bold",
}

type AnswerProps = {
    question: Question
    answer: string
    fieldChangeAction: (value: string) => void
    isCorrect?: boolean | null 
}

export default function InputAnswer({ question, answer, fieldChangeAction, isCorrect=null}: AnswerProps) {
    const state = getAnswerState(answer.trim() !== "", isCorrect)
    return (
        <>
            {question.question_type === "free response" ? (

                <div className="flex items-center justify-center">
                    <input
                        name="answer"
                        value={answer}
                        onChange={(e) => fieldChangeAction(e.target.value)}
                        className={`
                            w-full h-13 p-2.5 border rounded text-md font-semibold
                            ${inputStyles[state]}`
                        }
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    {Object.entries(question.multiple_choices || {}).map(
                        ([letter, choice]) => {
                            const rendered = renderLatex(choice)
                            const state = getAnswerState(answer === letter, isCorrect)

                            return (
                                <button
                                    key={letter}
                                    onClick={() => fieldChangeAction(letter)}
                                    className={`
                                        flex items-start gap-3 px-4 py-2 w-full min-h-13
                                        rounded-2xl border
                                        text-left text-base
                                        cursor-pointer hover:bg-accent/80 hover:border-accent hover:font-semibold
                                        transition-all duration-200 
                                        ${containerStyles[state]}`}
                                >
                                    <div
                                        className={`
                                            w-8 h-8 shrink-0 rounded-full flex items-center justify-center border text-sm 
                                            ${circleStyles[state]}`}
                                    >
                                        {letter}
                                    </div>
                                    <span className={`flex-1 p-1 leading-relaxed whitespace-normal text-base ${textStyles[state]}`}>
                                        <span
                                            className="flex-1"
                                            dangerouslySetInnerHTML={{ __html: rendered }}
                                        />
                                    </span>
                                </button>
                            )
                        }
                    )}
                </div>
            )}
        </>
    )
}