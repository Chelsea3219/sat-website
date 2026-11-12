"use client"

import {IncomingSilverQuestions, MCProps, UseFileUploaderReturn, ImageCategory } from "@/types/question-processing";
import QuestionEditor from "./QuestionEditor";
import ExplanationEditor from "./ExplanationEditor";
import QuestionPreview from "./QuestionPreview";
import { X, ArrowRight, ArrowLeft} from "lucide-react";
import { IncomingAnswerExplanations } from "@/types/answer-explanations";


type Props = {
    activeTab: "Question" | "Preview" | "Explanation"
    onTabChange: (tab: "Question" | "Preview" | "Explanation") => void

    question: IncomingSilverQuestions| null
    explanation: IncomingAnswerExplanations | null

    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    explanationFieldChange: <K extends keyof IncomingAnswerExplanations>(field: K, value: IncomingAnswerExplanations[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    mcChangeAll: (letter:MCProps) => void

    handleImageAction: (field:File, category:ImageCategory) => void
    diagramUploader: UseFileUploaderReturn

    saveQuestion: (queestion:IncomingSilverQuestions) => void
    saveExplanation: (explanation:IncomingAnswerExplanations) => void
    saving: boolean

    handleDelete: (questionId:string ) => void
    deleting: boolean

    nextIndex: () => void 
    previousIndex: () => void 
    onClose: () => void
}

// Styles 
const buttonStyle = "rounded-lg py-1 text-md font-semibold text-white border-2 hover:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer "



export default function QuestionEditorPreview({
    activeTab, onTabChange, question, explanation, explanationFieldChange, fieldChangeAction, mcFieldChangeAction, mcChangeAll, handleImageAction, diagramUploader, saveQuestion, saveExplanation, saving, handleDelete, deleting, nextIndex, previousIndex, onClose
}:Props) {
    if (!question) return 
    
    const handleSave = () => {
        if (activeTab === "Question") {
            saveQuestion(question)
            return
        } else if (activeTab === "Explanation" && explanation) {
            saveExplanation(explanation)
            return
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-title"
                className="flex h-[95vh] max-h-[95vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-xl overflow-y-hidden"
            >
                {/* Header: always visible */}
                <div role="tablist" className="shrink-0 flex items-center justify-between border-b border-secondary px-4 py-3">
                    {/* Question ID and Tabs */}
                    <div className="flex flex-row gap-2">
                        <p id="preview-title" className="font-semibold">{question.question_id}</p>
                        {(["Question", "Preview", "Explanation"] as const).map((tab) => (
                            <button 
                                key={tab}
                                type="button" 
                                role={tab} 
                                aria-selected={activeTab === tab}
                                onClick={() => onTabChange(tab)}
                                className={`rounded-lg border px-3 py-1 text-sm font-semibold transition-all ${
                                    activeTab === tab
                                        ? "border-primary bg-primary text-white"
                                        : "border-secondary text-primary hover:bg-secondary/30"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Next/Previous Question and Close window */}
                    <div className="flex flex-row gap-2">
                        {[
                            {label: "Previous", Icon: ArrowLeft, onClick:previousIndex, className:"rounded-full p-1 text-white bg-primaryOne/60 hover:opacity-50"}, 
                            {label: "Next", Icon: ArrowRight, onClick:nextIndex, className:"rounded-full p-1 text-white bg-primaryOne/60 hover:opacity-50"}, 
                            {label: "Close", Icon: X, onClick:onClose, className:"rounded-full p-1 text-red-600 bg-red-100 hover:bg-red-200"}
                        ].map(({label, Icon, onClick, className}) => (
                                <div key={label} >
                                    <button
                                        type="button"
                                        onClick={onClick}
                                        aria-label="Close"
                                        className={className}
                                    >
                                        <Icon strokeWidth={2} className="w-5 h-5" />
                                    </button>
                                </div>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
                    {activeTab === "Question" ? 
                        <QuestionEditor 
                            question={question}
                            fieldChangeAction={fieldChangeAction}
                            mcFieldChangeAction={mcFieldChangeAction}
                            mcChangeAll={mcChangeAll}
                            handleImageAction={handleImageAction}
                            diagramUploader={diagramUploader}
                        />
                    : activeTab === "Explanation" ?
                        <div className="border border-primary p-2 rounded-lg min-h-full">
                            <ExplanationEditor 
                                answerExplanation={explanation} 
                                fieldChangeAction={explanationFieldChange}
                            />
                        </div>
                    : <QuestionPreview question={question} explanation={explanation}/>
                    }
                </div>



                {/* Delete or Save Progress Button */}
                <div className="shrink-0 grid grid-cols-2 gap-4 border-t border-secondary px-10 py-3">
                    {[
                        {label:"Delete", onClick:()=>handleDelete(question.question_id ?? ""), disabled:deleting, className:`${buttonStyle} bg-red-500 `}, 
                        {label:saving ? "Updating": "Update", onClick:handleSave, disabled:deleting,  className:`${buttonStyle} bg-green-500`}, 
                    ].map(({label, onClick, className}) => (
                        <button
                            key={label}
                            type="button"
                            onClick={onClick}
                            className={className}
                        >
                            {label} {activeTab === "Question" ? "Question" : "Explanation"}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}