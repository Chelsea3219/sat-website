import { IncomingAnswerExplanations } from "@/types/answer-explanations"
import { renderLatex } from "@/utils/latexHelpers"
import ReadOnlyContent from "@/components/tab-window/helpers/ReadOnlyEditor"



export default function ExplanationPreview({ explanation }: { explanation: IncomingAnswerExplanations | null}) {

    if (!explanation) return (
        <div className="h-full min-w-0">
            <div className="border border-primary p-2 rounded-lg min-h-full">
                <p className="text-red-500 text-center">No explanation available</p>
            </div>
        </div>
    )

    return (
        <div className="h-full min-w-0">
            <div className="min-h-full">

                {/* Description */}
                <p className="font-semibold tracking-wide text-md">Description</p>
                <ReadOnlyContent
                    content={explanation.ai_answer_explanation?.description}
                    className="font-medium text-md leading-snug mb-4"
                />
                
                <ul className="pl-4">
                    {explanation.ai_answer_explanation?.steps.map((step, index) => (
                        <li key={index} className="mb-2 flex flex-row items-start gap-4 ">

                            <p className="font-semibold text-lg text-primary">{step.step_number}.</p>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-md text-primary">{step.title}</p>
                                <ul>
                                    {step.content.map((contentItem, contentIndex) => (
                                        <li key={contentIndex} className="w-full">
                                            {contentItem.type === "latex" ? (
                                                <div className="flex items-center justify-center w-full">
                                                    <div
                                                        className="text-xl font-bold mb-1 text-center"
                                                        dangerouslySetInnerHTML={{ __html: renderLatex(contentItem.value) }}
                                                    />
                                                </div>
                                            ) : (
                                                <ReadOnlyContent
                                                    key={contentIndex}
                                                    content={contentItem.value}
                                                    className="font-medium text-md leading-snug"
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}