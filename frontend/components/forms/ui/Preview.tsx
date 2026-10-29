import { useRef } from "react";
import { IncomingSilverQuestions } from "@/types/question-processing"
import {renderLatex} from "@/utils/latexHelpers";
import ReadOnlyContent from "@/components/tab-window/helpers/ReadOnlyEditor";

type PreviewProps = {
    questions: IncomingSilverQuestions[]
    saving: boolean
    onConfirm: () => void 
    onDismiss: () => void
}

export default function Preview({questions, saving, onConfirm, onDismiss}: PreviewProps) {

    const buttonStyle = "rounded-xl border-2 px-5 py-2 text-center cursor-pointer font-semibold transition-all"
    //" border-2 border-primary px-5 py-2 text-primary disabled:cursor-not-allowed disabled:opacity-50"

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-title"
                className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl"
            >
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-5">
                    <h2
                        id="preview-title"
                        className="text-2xl font-semibold text-slate-900"
                    >
                        Preview Questions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Review your questions before uploading them to the
                        database.
                    </p>

                    <p className="mt-2 text-sm font-medium text-primary">
                        {questions.length} question
                        {questions.length === 1 ? "" : "s"} ready to upload
                    </p>
                </div>

                {/* Question list */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                    {questions.map((q) => (
                        <article
                            key={q.question_id}
                            className="space-y-3 rounded-xl border border-gray-200 p-4"
                        >
                            {q.question_id && <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Question ID: {q.question_id}
                            </p>}

                            <ReadOnlyContent 
                                content={q.text ?? ""} 
                                className="whitespace-pre-wrap text-sm leading-6 text-slate-900"
                            />
                            

                            {q.equation && (
                                <span
                                    className="flex justify-center"
                                    dangerouslySetInnerHTML={{ __html: renderLatex(q.equation) }}
                                />
                            )}

                            {q.question_type !== "free response" &&
                                q.multiple_choices && (
                                    <div className="space-y-2">
                                        {Object.entries(q.multiple_choices).map(([letter, choice]) => (
                                            
                                            <div key={letter} className="flex flex-row gap-x-1 items-center">
                                                <p className="font-bold text-primary p-1">{letter}</p>
                                                <span className={`flex-1 min-w-0 p-1 h-auto leading-snug whitespace-normal text-base`}>
                                                    <span
                                                        className="answer-choice flex-1"
                                                        dangerouslySetInnerHTML={{ __html: renderLatex(choice) }}
                                                    />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </article>
                    ))}
                </div>

                {/* Footer actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">
                    <button // 
                        type="button"
                        onClick={onDismiss}
                        disabled={saving}
                        className={`${buttonStyle} border-primary text-primary hover:bg-primary/70 hover:text-white`}
                    >
                        Continue
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={saving || questions.length === 0}
                        className={`${buttonStyle} bg-primary text-white hover:bg-primary/70`}
                    >
                        {saving ? "Uploading..." : "Confirm & Save"}
                    </button>
                </div>
            </section>
        </div>
    )
}