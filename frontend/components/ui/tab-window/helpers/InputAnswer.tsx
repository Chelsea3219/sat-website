import { Question} from "@/types/questions";
import "@/css/tab-window.css"
import "@/css/forms/form.css"
import {renderLatex} from "@/utils/latexHelpers";


type AnswerProps = {
    question: Question
    answer: string
    fieldChangeAction: (value: string) => void
}

export default function InputAnswer({ question, answer, fieldChangeAction }: AnswerProps) {
    return (
        <>
            {question.question_type === "free response" ? (
                <div className="input-group flex items-center justify-center">
                    <input
                        name="answer"
                        value={answer}
                        onChange={(e) => fieldChangeAction(e.target.value)}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    {Object.entries(question.multiple_choices || {}).map(
                        ([letter, choice]) => {
                            const rendered = renderLatex(choice)
                            return (
                                <button
                                    key={letter}
                                    onClick={() => fieldChangeAction(letter)}
                                    className={`
                                        flex items-start gap-3 
                                        px-4 py-2
                                        w-full min-h-13
                                        rounded-2xl border
                                        text-left text-base
                                        cursor-pointer hover:bg-accent/80 hover:border-accent hover:font-semibold
                                        transition-all duration-200 
                                        ${
                                            answer === letter
                                                ? "border-primary border-3 font-bold"
                                                : "border-slate-900"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border text-sm ${answer === letter ? "border-primary text-primary border-3 font-bold" : "border-slate-900"}`}
                                    >
                                        {letter}
                                    </div>
                                    <span className={`flex-1 p-1 leading-relaxed whitespace-normal text-base ${answer === letter ? "text-base text-primary font-bold" : "text-sm"}`}>
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