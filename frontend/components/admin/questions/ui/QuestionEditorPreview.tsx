"use client"

import {IncomingSilverQuestions, MCProps, UseFileUploaderReturn, ImageCategory } from "@/types/question-processing";
import RenderFormField from "./RenderFormField";
import { X} from "lucide-react";
import SubtopicEditor from "@/components/admin/questions/ui/SubtopicEditor";
import MCEditor from "@/components/admin/questions/ui/MCEditor";
import { readingTopics, mathTopics } from "@/utils/admin/topics";
import LaTexInput from "@/components/admin/questions/ui/LaTexInput";
import SnippetButtons from "@/components/admin/questions/ui/SnippetButtons";
import RichContentEditor from "./RichContentEditor";
import Image from "next/image";
import FileUploader from "@/components/forms/FileUploader";


type Props = {
    question: IncomingSilverQuestions| null 
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    mcChangeAll: (letter:MCProps) => void
    handleImageAction: (field:File, category:ImageCategory) => void
    diagramUploader: UseFileUploaderReturn
    saveQuestion: (queestion:IncomingSilverQuestions) => void
    handleDelete: (questionId:string ) => void
    deleting: boolean
    onClose: () => void
}

// Styles 
const labelStyle = "uppercase tracking-wide text-primary text-xs"
const buttonStyle = "rounded-lg py-1 text-md font-semibold text-white border-2 hover:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer "



export default function QuestionEditorPreview({question, fieldChangeAction, mcFieldChangeAction, mcChangeAll, handleImageAction, diagramUploader, saveQuestion, handleDelete, deleting, onClose}:Props) {
    if (!question) return 

    const handleDiagramFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "diagram")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="preview-title"
                className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl overflow-hidden"
            >
                {/* Header: always visible */}
                <div className="shrink-0 flex items-center justify-between border-b border-secondary px-4 py-3">
                    <p id="preview-title" className="font-semibold">{question.question_id}</p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-1 text-red-600 bg-red-100 hover:bg-red-200"
                    >
                        <X strokeWidth={2} className="w-5 h-5" />
                    </button>
                </div>


                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">

                    {/* Section, Topic, Difficulty, and Question type */}
                    <div className="w-full grid grid-col-2 md:grid-cols-4 gap-2 ">
                        <RenderFormField label="Section" value={question.section} type="select" options={["math", "reading"]} fieldChangeAction={(value) => fieldChangeAction("section", value)} labelStyle={labelStyle}/>
                        <RenderFormField label="Topic" value={question.topic} type="select" options={question.section === 'math' ? mathTopics : readingTopics} fieldChangeAction={(value) => fieldChangeAction("topic", value)} labelStyle={labelStyle}/>
                        <RenderFormField label="Difficulty" value={question.difficulty ?? ""} type="select" options={["easy", "medium", "hard"]} fieldChangeAction={(value) => fieldChangeAction("difficulty", value)}labelStyle={labelStyle}/>
                        <RenderFormField label="Question Type" value={question.difficulty ?? ""} type="select" options={["free response", "multiple choice"]} fieldChangeAction={(value) => fieldChangeAction("question_type", value)} labelStyle={labelStyle}/>
                    </div>

                    {/* Subtopic */}
                    <div>
                        <label className={labelStyle} aria-hidden >subtopic(s)</label>
                        <SubtopicEditor subtopic={question.subtopic} onChangeAction={(value) => fieldChangeAction("subtopic", value)}/>
                    </div>

                    {/* Question Editor */}
                    <div>
                        <label className={labelStyle} aria-hidden >Text</label>
                        <RichContentEditor
                            value={question.text}
                            onChangeAction={(html) => fieldChangeAction("text", html)}
                            className="rounded-lg border border-primary p-2 min-h-24"
                        />
                    </div>

                    {/* Reading Question or Equation */}
                    {question.section === "reading" ? (
                        <RenderFormField label="Question" value={question.reading_question} type="input" fieldChangeAction={(value) => fieldChangeAction("reading_question", value)} labelStyle={labelStyle}/>
                    ) : (
                        <>
                            <label className={labelStyle} aria-hidden >Equation</label>
                            <div className="w-full min-w-0 border border-primary rounded-lg p-2 min-h-30">
                                <div className="border-b border-primary pb-2 mb-2 ">
                                        <SnippetButtons />
                                </div>
                                <LaTexInput
                                    value={question.equation ?? ""}
                                    isEquation
                                    onChangeAction={(value) => fieldChangeAction("equation", value)}
                                />
                            </div>
                        </>
                    )}

                    {question.diagram && (
                        <>
                            <label className={labelStyle} aria-hidden >Diagram</label>
                            <Image
                                src={question.diagram}
                                alt={question.question_id ?? ""}
                                width={1500} height={1500}
                                className="w-full h-auto mt-4 object-contain" 
                            />
                            <FileUploader
                                onFile={handleDiagramFile}
                                previewURL={diagramUploader.previewURL}
                                resetUpload={diagramUploader.resetUpload}
                                handleChange={diagramUploader.handleChange}
                                inputRef={diagramUploader.inputRef}
                            />

                        </>
                    )}

                    <label className={labelStyle} aria-hidden >Multiple Choices</label>
                    <MCEditor
                        section={question.section}
                        mc={question.multiple_choices ?? { A: "", B: "", C: "", D: "" }}
                        isEquation={false}
                        onChangeAction={(letter, value) => mcFieldChangeAction(letter, value)}
                        onChangeAllAction={mcChangeAll}
                    />

                    {/* Answer Key */}
                    {question.question_type === "free response" ? (
                        <>
                            <label className={labelStyle} aria-hidden >answer key</label>
                            <SubtopicEditor subtopic={question.answer_key ?? []} onChangeAction={(value) => fieldChangeAction("answer_key", value)} />
                        </>
                    ) : (
                        <RenderFormField label="answer key" value={question.answer_key ?? []} type="select" options={["A", "B", "C", "D"]} fieldChangeAction={(value) => fieldChangeAction("answer_key", value)} labelStyle={labelStyle}/>
                    )}
                </div>


                {/* Delete or Save Progress Button */}
                <div className="grid grid-cols-2 gap-4 border-t border-secondary px-10 py-3">
                    {[
                        {label:"Delete", onClick:()=>handleDelete(question.question_id ?? ""), disabled:deleting, className:`${buttonStyle} bg-red-500 `}, 
                        {label:"Update", onClick:() => saveQuestion(question), disable:deleting,  className:`${buttonStyle} bg-green-500`}, 
                    ].map(({label, onClick, className}) => (
                        <button
                            key={label}
                            type="button"
                            onClick={onClick}
                            className={className}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}