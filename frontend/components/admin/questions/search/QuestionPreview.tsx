import ReadOnlyContent from "@/components/tab-window/helpers/ReadOnlyEditor"
import 'katex/dist/katex.min.css'
import { IncomingSilverQuestions } from "@/types/question-processing";
import Image from "next/image";
import {renderLatex} from "@/utils/latexHelpers"
import { IncomingAnswerExplanations } from "@/types/answer-explanations";

type PreviewProps = {
    question: IncomingSilverQuestions
    explanation: IncomingAnswerExplanations | null 
}

export default function QuestionPreview({question, explanation}: PreviewProps) {

    if (!question) return 

    return (
        <div>
            <div className="p-8 space-y-2">
            
                {/* Difficulty */}
                <p className="uppercase text-primary font-semibold text-md">{question.difficulty}</p>

                {/* Question Text */}
                <ReadOnlyContent
                    key={question.question_id}
                    content={question.text}
                    className="font-medium text-lg leading-snug"
                />

                {/* Equation */}
                {question.equation && (
                    <div
                        className="flex items-center justify-center text-xl font-semibold mb-1"
                        dangerouslySetInnerHTML={{
                            __html: renderLatex(question.equation)
                        }}
                    />
                )}

                {/* Reading Question */}
                {question.reading_question && (
                    <ReadOnlyContent
                        key={question.question_id}
                        content={question.reading_question}
                        className="font-medium text-lg leading-snug"
                    />
                )}

                {/* MC and Diagram*/}
                <div className="flex flex-row gap-4 items-center mt-6">
                    {question.question_type === "multiple choice" && 
                        <div className="flex flex-col gap-4 flex-1">
                            {Object.entries(question.multiple_choices || {}).map(([letter, choice]) => {
                                const rendered = renderLatex(choice)
                                return (
                                    <button
                                        key={letter}
                                        className={`
                                            flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 w-full h-auto
                                            rounded-2xl border
                                            text-left text-base
                                            cursor-pointer hover:bg-accent/80 hover:border-accent hover:font-semibold
                                            transition-all duration-200`}
                                    >
                                        <div
                                            className={`
                                                w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center border text-sm`}
                                        >
                                            {letter}
                                        </div>
                                        <span className={`flex-1 min-w-0 p-1 h-auto leading-snug whitespace-normal text-base`}>
                                            <span
                                                className="answer-choice flex-1"
                                                dangerouslySetInnerHTML={{ __html: rendered }}
                                            />
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    }

                    {question.diagram && (
                        <div className="flex justify-center flex-1">
                            <Image
                                src={question.diagram}
                                alt={question.question_id ?? ""}
                                width={500} height={500}
                                className="w-xs h-auto mt-4 object-contain" 
                            />
                        </div>
                    )}
                </div>

                {/* Hints */}
                {([explanation?.hint_1, explanation?.hint_2] as const).map((hint, index) => (
                    <div key={index} className="flex flex-row space-x-4 items-start">
                        <p className="w-16 shrink-0 font-semibold">Hint {index+1}</p>
                        <p className="flex-1">{hint}</p>
                    </div>
                ))}
        
                            
            </div>
        </div>
    )
}