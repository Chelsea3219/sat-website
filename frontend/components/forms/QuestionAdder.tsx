import SubtopicEditor from "@/components/forms/ui/SubtopicEditor";
import TextEditor from "@/components/forms/ui/TextEditor";
import LaTexInput from "@/components/forms/ui/LaTexInput";
import FileUploader from "@/components/forms/FileUploader";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader";
import MCEditor from "@/components/forms/ui/MCEditor";
import {IncomingSilverQuestions, MCProps, ImageCategory} from "@/types/question-processing";
import TopicSelector from "./ui/TopicSelector";
import "@/css/forms/form.css"
import AnswerEditor from "@/components/forms/ui/AnswerEditor";

type UseFileUploaderReturn = ReturnType<typeof useFileUploader>

type Props = {
    form: IncomingSilverQuestions
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    handleImageAction: (field:File, category:ImageCategory) => void
    previewUploader: UseFileUploaderReturn
    diagramUploader: UseFileUploaderReturn

}

export default function QuestionAdder(
    {form, fieldChangeAction, handleImageAction, mcFieldChangeAction, previewUploader, diagramUploader}: Props
) {
    const handlePreviewFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "question_preview")
    }

    const handleDiagramFile = async (file: File | null) => {
        if (!file) return
        await handleImageAction(file, "diagram")
    }

    // Title Style 
    const titleStyle = "block mb-6 text-md font-medium uppercase tracking-wide text-main"


    return (
        <>
            <div className="pt-16 md:px-2 lg:px-4 pb-4">

                {/* Question Editor */}
                <div className="flex gap-4 mt-4">
                    {/* Question Information ------------------------------------------------------------------------*/}
                    <div className="flex-4 w-full space-y-4">

                        {/* Section and Topic */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="input-group flex-1/3">
                                <label>Section</label>
                                <select
                                    value={form.section}
                                    onChange={(e) => fieldChangeAction("section", e.target.value)}
                                >
                                    <option value="">Please select</option>
                                    <option value="math">Math</option>
                                    <option value="reading">Reading</option>
                                </select>
                            </div>
                            <div className="input-group flex-1/3">
                                <label>Topic</label>
                                <TopicSelector
                                    section={form.section}
                                    topic={form.topic}
                                    fieldChangeAction={topic => fieldChangeAction("topic", topic)}
                                />
                            </div>
                            <div className="input-group flex-1/3">
                                <label>Source</label>
                                <select
                                    value={form.source}
                                    onChange={(e) => fieldChangeAction("source", e.target.value)}
                                >
                                    <option value="">Please select</option>
                                    <option value="preppros">Preppros</option>
                                    <option value="college board">College Board</option>
                                    <option value="myself">Myself</option>
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

                        {form.section === "math" &&
                            /* Equation and its Latex Preview */
                            <div className="input-group">
                                <label>Equation</label>
                                <LaTexInput
                                    value={form.equation ?? ""}
                                    onChangeAction={(value) => fieldChangeAction("equation", value)}
                                />
                            </div>
                        }

                        {/* Multiple Choice and its Latex Preview */}
                        {(form.question_type === "multiple choice" || form.section === "reading") &&
                            <div className="input-group w-full">
                                <label>Multiple Choices</label>
                                <MCEditor
                                    mc={form.multiple_choices ?? {A: "", B: "", C: "", D: ""}}
                                    onChangeAction={(letter, value) => mcFieldChangeAction(letter, value)}
                                />
                            </div>
                        }

                        {/* Correct Answer */}
                        <div className="input-group">
                            <label>Answer</label>
                            {(form.question_type === "free response") &&
                               <AnswerEditor
                                        answer={form.answer_key ?? ""}
                                        onChangeAction={answer_key => fieldChangeAction("answer_key", answer_key)}
                               />

                            }
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
                    </div>

                    {/* Question Preview ----------------------------------------------------------------------------*/}
                    <div className="flex-1 sticky top-20 self-start h-full space-y-8">
                        {/* Diagram Uploader */}
                        <div className={titleStyle}>
                            <label>Question Preview</label>
                            <FileUploader
                                onFile={handlePreviewFile}
                                previewURL={previewUploader.previewURL}
                                resetUpload={previewUploader.resetUpload}
                                handleChange={previewUploader.handleChange}
                                inputRef={previewUploader.inputRef}
                            />
                        </div>

                        {/* Diagram Uploader */}
                        <div className={titleStyle}>
                            <label>Diagram</label>
                            <FileUploader
                                onFile={handleDiagramFile}
                                previewURL={diagramUploader.previewURL}
                                resetUpload={diagramUploader.resetUpload}
                                handleChange={diagramUploader.handleChange}
                                inputRef={diagramUploader.inputRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}