
"use client"

import {IncomingSilverQuestions, MCProps, UseFileUploaderReturn, ImageCategory } from "@/types/question-processing";
import RenderFormField from "../ui/RenderFormField";
import SubtopicEditor from "@/components/admin/questions/ui/SubtopicEditor";
import MCEditor from "@/components/admin/questions/ui/MCEditor";
import ReadOnlyContent from "@/components/tab-window/helpers/ReadOnlyEditor";
import TextEditor from "../ui/TextEditor";
import { readingTopics, mathTopics } from "@/utils/admin/topics";
import LaTexInput from "@/components/admin/questions/ui/LaTexInput";
import SnippetButtons from "@/components/admin/questions/ui/SnippetButtons";
import Image from "next/image";
import FileUploader from "@/components/forms/FileUploader";


// Styles 
const labelStyle = "uppercase tracking-wide text-primary text-xs"

type Props = {
    question: IncomingSilverQuestions | null
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    mcChangeAll: (letter:MCProps) => void
    handleImageAction: (field:File, category:ImageCategory) => void
    diagramUploader: UseFileUploaderReturn
}



export default function QuestionEditor({
    question, fieldChangeAction, mcFieldChangeAction, mcChangeAll, handleImageAction, diagramUploader
}: Props) {

    if (!question) return 

    const handleDiagramFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "diagram")
    }

    return (
        <div className="p-4 space-y-4">

            {/* Section, Topic, Difficulty, and Question type */}
            <div className="w-full grid grid-col-2 md:grid-cols-4 gap-2 ">
                <RenderFormField label="Section" value={question.section} type="select" options={["math", "reading"]} fieldChangeAction={(value) => fieldChangeAction("section", value)} labelStyle={labelStyle}/>
                <RenderFormField label="Topic" value={question.topic} type="select" options={question.section === 'math' ? mathTopics : readingTopics} fieldChangeAction={(value) => fieldChangeAction("topic", value)} labelStyle={labelStyle}/>
                <RenderFormField label="Difficulty" value={question.difficulty ?? ""} type="select" options={["easy", "medium", "hard"]} fieldChangeAction={(value) => fieldChangeAction("difficulty", value)}labelStyle={labelStyle}/>
                <RenderFormField label="Question Type" value={question.question_type ?? ""} type="select" options={["free response", "multiple choice"]} fieldChangeAction={(value) => fieldChangeAction("question_type", value)} labelStyle={labelStyle}/>
            </div>

            {/* Subtopic */}
            <div>
                <label className={labelStyle} aria-hidden >subtopic(s)</label>
                <SubtopicEditor subtopic={question.subtopic} onChangeAction={(value) => fieldChangeAction("subtopic", value)}/>
            </div>

            {/* Question Editor */}
            <div className="w-full">
                <label className={labelStyle} aria-hidden >Text</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 border border-primary p-2 rounded-md">
                    <TextEditor
                        text={question.text}
                        fieldChangeAction={(value) => fieldChangeAction("text", value)}
                    />
                    <ReadOnlyContent
                        key={question.question_id}
                        content={question.text}
                        className="font-medium text-lg leading-snug border border-primary rounded-lg p-4 bg-gray-50"
                    />
                </div>
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
                    <div className="flex justify-center">
                        <Image
                            src={question.diagram}
                            alt={question.question_id ?? ""}
                            width={500} height={500}
                            className="w-xs h-auto mt-4 object-contain" 
                        />
                    </div>
                    <FileUploader
                        onFile={handleDiagramFile}
                        previewURL={diagramUploader.previewURL}
                        resetUpload={diagramUploader.resetUpload}
                        handleChange={diagramUploader.handleChange}
                        inputRef={diagramUploader.inputRef}
                    />

                </>
            )}

            {/* Answer Key */}
            {question.question_type === "free response" ? (
                <>
                    <label className={labelStyle} aria-hidden >answer key</label>
                    <SubtopicEditor subtopic={question.answer_key ?? []} onChangeAction={(value) => fieldChangeAction("answer_key", value)} />
                </>
                
            ) : (
                <>
                    <label className={labelStyle} aria-hidden >Multiple Choices</label>
                    <MCEditor
                        section={question.section}
                        mc={question.multiple_choices ?? { A: "", B: "", C: "", D: "" }}
                        isEquation={false}
                        onChangeAction={(letter, value) => mcFieldChangeAction(letter, value)}
                        onChangeAllAction={mcChangeAll}
                    />
                    <RenderFormField label="answer key" value={question.answer_key ?? []} type="select" options={["A", "B", "C", "D"]} fieldChangeAction={(value) => fieldChangeAction("answer_key", value)} labelStyle={labelStyle}/>
                </>
            )}
        </div>
    )
}