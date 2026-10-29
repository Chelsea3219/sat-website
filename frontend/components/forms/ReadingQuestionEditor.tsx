

"use client"

import "@/css/forms/form.css"
import TextEditor from "@/components/forms/ui/TextEditor";
import FileUploader from "@/components/forms/FileUploader";
import MCEditor from "@/components/forms/ui/MCEditor";
import SubtopicEditor from "@/components/forms/ui/SubtopicEditor";
import {IncomingSilverQuestions, MCProps, UseFileUploaderReturn, ImageCategory} from "@/types/question-processing";




type Props = {
    form: IncomingSilverQuestions
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    mcChangeAll: (letter:MCProps) => void
    handleImageAction: (field:File, category:ImageCategory) => void
    diagramUploader: UseFileUploaderReturn
    onDeleteAction: () => void
    deleting: boolean
}



export default function ReadingQuestionEditor(
    {form, fieldChangeAction, mcFieldChangeAction, mcChangeAll, handleImageAction, diagramUploader, onDeleteAction, deleting}: Props
){

    const handleDiagramFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "diagram")
    }

    if (form.section === "math") return 

    console.log("form.question_type:", JSON.stringify(form.question_type), "form.mc:", form.multiple_choices)

    return (
        <>
            <div className="px-2 md:px-6 lg:px-8 pt-4">

                <div>

                        {/* Question Information ------------------------------------------------------------------------*/}
                        <div className="lg:col-span-4 min-w-0 space-y-4 ">

                            {/* Question Id and section */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="input-group flex-1">
                                    <label>Question ID</label>
                                    <div className="field text-primary">{form.question_id}</div>
                                </div>
                                <div className="input-group flex-1">
                                    <label>Section</label>
                                    <div className="field">{form.section}</div>
                                </div>
                            </div>

                            {/* Topic and Difficulty */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                
                                <div className="input-group flex-1">
                                    <label>Topic</label>
                                    <div className="field">{form.topic}</div>
                                </div>
                                <div className="input-group flex-1">
                                    <label>Difficulty</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => fieldChangeAction("difficulty", e.target.value)}
                                    >
                                        <option value="">Please Select</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* Subtopic */}
                            <div className="input-group">
                                <label>Subtopic(s)</label>
                                <SubtopicEditor
                                    subtopic={form.subtopic}
                                    onChangeAction={subtopic => fieldChangeAction("subtopic", subtopic)}
                                />
                            </div>

                            {/* Text */}
                            <div className="input-group">
                                <label>Text</label>
                                <div className="w-full min-w-0 border border-primary rounded-lg p-2 min-h-30">
                                    <TextEditor
                                        text={form.text}
                                        fieldChangeAction={(value) => fieldChangeAction("text", value)}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="input-group">
                                <label>Question</label>
                                <input
                                    value={form.reading_question ?? ""}
                                    onChange={(e) => fieldChangeAction("reading_question", e.target.value)}
                                />
                            </div>

                            {/* Diagram Uploader */}
                            <div >
                                <label className="block mb-2 text-md font-medium uppercase tracking-wide text-main">Diagram</label>
                                <FileUploader
                                    onFile={handleDiagramFile}
                                    previewURL={diagramUploader.previewURL}
                                    resetUpload={diagramUploader.resetUpload}
                                    handleChange={diagramUploader.handleChange}
                                    inputRef={diagramUploader.inputRef}
                                />
                            </div>

                            {/* Multiple Choice and its Latex Preview */}
                            {form.question_type === "multiple choice" &&
                                <div className="input-group w-full">
                                    <label>Multiple Choices</label>
                                    <MCEditor
                                        section={form.section}
                                        mc={form.multiple_choices ?? { A: "", B: "", C: "", D: "" }}
                                        isEquation={false}
                                        onChangeAction={(letter, value) => mcFieldChangeAction(letter, value)}
                                        onChangeAllAction={mcChangeAll}
                                    />
                                </div>
                            }

                            {/* Correct Answer */}
                            <div className="input-group">
                                <label>Answer</label>
                                {(form.question_type === "multiple choice" || form.question_type === "") &&
                                    <select
                                        value={form.answer_key}
                                        onChange={(e) => fieldChangeAction("answer_key", e.target.value)}
                                    >
                                        <option className="">Select</option>
                                        <option className="A">A</option>
                                        <option className="B">B</option>
                                        <option className="C">C</option>
                                        <option className="D">D</option>
                                    </select>
                                }
                            </div>

                            <button 
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-white hover:border-2 hover:border-red-500 hover:text-red-500 disabled:opacity-70 hover:font-bold transition-all"
                                onClick={onDeleteAction}
                                disabled={deleting}
                                >
                                {deleting ? "Deleting..." : "Delete Question"}
                            </button>

                        </div>

                </div>
            </div>
        </>
    )

}