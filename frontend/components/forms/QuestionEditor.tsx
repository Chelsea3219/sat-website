"use client"

import {Search} from 'lucide-react'
import "@/css/forms/form.css"
import TextEditor from "@/components/forms/ui/TextEditor";
import LaTexInput from "@/components/forms/ui/LaTexInput";
import FileUploader from "@/components/forms/FileUploader";
import MCEditor from "@/components/forms/ui/MCEditor";
import QuestionPreview from "@/components/forms/ui/QuestionMCPreview";
import SubtopicEditor from "@/components/forms/ui/SubtopicEditor";
import {IncomingSilverQuestions, SearchProps, MCProps, UseFileUploaderReturn, ImageCategory} from "@/types/question-processing";
import AnswerEditor from "@/components/forms/ui/AnswerEditor";

type Props = {
    form: IncomingSilverQuestions
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    search: SearchProps
    searchChangeAction: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSearchAction: () => void
    handleImageAction: (field:File, category:ImageCategory) => void
    diagramUploader: UseFileUploaderReturn
}

export default function QuestionEditor(
    {form, fieldChangeAction, mcFieldChangeAction, search, searchChangeAction, handleSearchAction, handleImageAction, diagramUploader}: Props
){

    const handleDiagramFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "diagram")
    }

    return (
        <>
            <div className="pt-16 max-w-7xl mx-auto px-2 md:px-6 lg:px-8">

                <div>
                    {/* Search Bar */}
                    <div className="flex flex-row bg-primary/60 rounded-xl p-3 gap-x-4">
                        <select
                            name="searchName"
                            value={search.searchName}
                            onChange={searchChangeAction}
                            className="w-40 bg-white rounded-xl p-2 font-semibold text-xl text-primary"
                        >
                            <option value="">Select type</option>
                            <option value="section">Section</option>
                            <option value="topic">Topic</option>
                            <option value="subtopic">Subtopic</option>
                        </select>

                        <input
                            name="searchValue"
                            placeholder="Enter the filter"
                            value={search.searchValue}
                            onChange={searchChangeAction}
                            className="flex-1 bg-white rounded-xl p-2 font-medium text-lg"
                            onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
                        />

                        <Search
                            onClick = {handleSearchAction}
                            className="flex items-center mt-1 justify-center rounded-lg text-xl text-white font-bold w-8 h-8 hover:border-2 hover:border-primary hover:scale-110"
                        />
                    </div>

                    {/* Question Editor */}
                    <div className="flex gap-4 mt-4">
                        {/* Question Information ------------------------------------------------------------------------*/}
                        <div className="flex-4 w-full space-y-4">

                            {/* Section and Topic */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="input-group flex-1">
                                    <label>Section</label>
                                    <div className="field">{form.section}</div>
                                </div>
                                <div className="input-group flex-1">
                                    <label>Topic</label>
                                    <div className="field">{form.topic}</div>
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

                            {/* Difficulty and Question Type */}
                            <div className="flex flex-col sm:flex-row gap-4">
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
                                <div className="input-group flex-1">
                                    <label>Question Type</label>
                                    <select
                                        value={form.question_type}
                                        onChange={(e) => fieldChangeAction("question_type", e.target.value)}
                                    >
                                        <option value="">Please Select</option>
                                        <option value="free response">Free Response</option>
                                        <option value="multiple choice">Multiple Choice</option>
                                    </select>
                                </div>
                            </div>

                            {/* Text */}
                            <div className="input-group">
                                <label>Question Text</label>
                                <TextEditor
                                    text={form.text}
                                    fieldChangeAction={(value) => fieldChangeAction("text", value)}
                                />
                            </div>

                            {/* Equation and its Latex Preview */}
                            <div className="input-group">
                                <label>Equation</label>
                                <LaTexInput
                                    value={form.equation ?? ""}
                                    onChangeAction={(value) => fieldChangeAction("equation", value)}
                                />
                            </div>

                            {/* Diagram Uploader */}
                            <div >
                                <label className="block mb-6 text-md font-medium uppercase tracking-wide text-main">Diagram</label>
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
                                        mc={form.multiple_choices ?? { A: "", B: "", C: "", D: "" }}
                                        onChangeAction={(letter, value) => mcFieldChangeAction(letter, value)}
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
                                {form.question_type === "free response" &&
                                    <AnswerEditor
                                        answer={form.answer_key ?? ""}
                                        onChangeAction={answer_key => fieldChangeAction("answer_key", answer_key)}
                                    />
                                }
                            </div>
                        </div>

                        {/* Question Preview ----------------------------------------------------------------------------*/}
                        <div className="flex-1 sticky top-20 self-start h-full space-y-4">
                            <QuestionPreview
                                question_preview={form.question_preview}
                                mc_preview={form.mc_preview ?? ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}