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
import SnippetButtons from "@/components/forms/ui/SnippetButtons";



type UseFileUploaderReturn = ReturnType<typeof useFileUploader>

type Props = {
    form: IncomingSilverQuestions
    fieldChangeAction: <K extends keyof IncomingSilverQuestions>(field: K, value: IncomingSilverQuestions[K]) => void
    mcFieldChangeAction: (letter: keyof MCProps, value: string) => void
    mcChangeAll: (letter:MCProps) => void
    handleImageAction: (field:File, category:ImageCategory) => void
    previewUploader: UseFileUploaderReturn
    diagramUploader: UseFileUploaderReturn

}

export default function QuestionAdder(
    {form, fieldChangeAction, handleImageAction, mcFieldChangeAction, mcChangeAll, previewUploader, diagramUploader}: Props
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
            <div className="pt-16 md:px-2 lg:px-4 pb-4 w-full">

                {/* Question Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,18rem)] gap-6 mt-4 w-full">
                    {/* Question Information ------------------------------------------------------------------------*/}
                    <div className="w-full min-w-0 space-y-4">

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

                        {/* Equation and its Latex Preview */}
                        {form.section === "math" &&
                            <div className="input-group">
                                <label>Equation</label>
                                <div className="w-full min-w-0 border border-primary rounded-lg p-2 min-h-30">
                                    <div className="border-b border-primary pb-2 mb-2 ">
                                            <SnippetButtons />
                                    </div>
                                    <LaTexInput
                                        value={form.equation ?? ""}
                                        isEquation
                                        onChangeAction={(value) => fieldChangeAction("equation", value)}
                                    />
                                </div>
                            </div>
                        }

                        {/* Multiple Choice and its Latex Preview */}
                        {(form.question_type === "multiple choice" || form.section === "reading") &&
                            <div className="input-group w-full">
                                <label>Multiple Choices</label>
                                <MCEditor
                                    section={form.section ?? "math"}
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
                    <div className="min-w-0 w-full sticky top-20 self-start space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden">
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