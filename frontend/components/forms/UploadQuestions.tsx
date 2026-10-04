"use client"

import '@/css/forms/form.css'
import useUploadQuestion from "@/hooks/admin/question-processing/useUploadQuestions";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FileUploader from "@/components/forms/FileUploader";
import {useState} from "react";
import HorizontalLoadingAnimation2 from "@/components/ui/loading-animation/HorizontalLoadingAnimation";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader";
import {useRouter} from "next/navigation";

export default function UploadQuestions() {
    const router = useRouter()

    const {fileForm, questions, error, setError, status, loading, fieldChange, handleSave, handlePreview, handleReset} = useUploadQuestion()

    const [file, setFile] = useState<File | null>(null)
    const { previewURL, resetUpload, handleChange, inputRef } = useFileUploader()

    const handleSaveClick = async () => {
        await handleSave()
        router.refresh()
        resetUpload()
        setFile(null)
        handleReset()
    }

    const handleDiscardClick = () => {
        resetUpload()
        setFile(null)
        handleReset()
    }

    return (
        <>
            <ErrorMessage error={error} onDismiss={()=> setError("")}/>


            <div className="">

                <div className="space-y-8">
                    {/* Upload the PDF */}
                    <div className="block mb-6 text-md font-medium uppercase tracking-wide text-main">
                        <label>Upload file</label>
                        <FileUploader 
                            onFile={setFile}
                            previewURL={previewURL}
                            resetUpload={resetUpload}
                            handleChange={handleChange}
                            inputRef={inputRef}
                        />
                    </div>

                    {/* PDF's source and section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="input-group flex-1">
                            <label>Source</label>
                            <select
                                name="source"
                                value={fileForm.source}
                                onChange={fieldChange}
                            >
                                <option value="">Select Source</option>
                                <option value="preppros">Preppros</option>
                            </select>
                        </div>

                        <div className="input-group flex-1">
                            <label>Section</label>
                            <select
                                name="section"
                                value={fileForm.section}
                                onChange={fieldChange}
                            >
                                <option value="">Select section</option>
                                <option value="math">Math</option>
                                <option value="reading">Reading</option>
                            </select>
                        </div>
                    </div>

                    {/* PDF's topic and subtopic */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="input-group flex-1">
                            <label>Topic</label>
                            <select
                                name="topic"
                                onChange={fieldChange}
                            >
                                {fileForm.section === "math" && (
                                    <>
                                        <option value="">Select topic</option>
                                        <option value="algebra">Algebra</option>
                                        <option value="advanced math">Advanced Math</option>
                                        <option value="problem solving & data analysis">Problem Solving & Data Analysis</option>
                                        <option value="geometry & trigonemetry">Geometry & Trigonometry</option>
                                    </>
                                )}

                                {fileForm.section === "reading" && (
                                    <>
                                        <option value="">Select topic</option>
                                        <option value="information & ideas">Information & Ideas </option>
                                        <option value="craft & structure">Craft & Structure</option>
                                        <option value="expression of ideas">Expression of Ideas</option>
                                        <option value="standard english conventions">Standard English Conventions</option>

                                    </>
                                    )
                                }
                            </select>
                        </div>

                        <div className="input-group flex-1">
                            <label>Subtopic</label>
                            <input
                                type="text"
                                value={fileForm.subtopic}
                                name = "subtopic"
                                onChange={fieldChange}
                            />
                        </div>

                    </div>

                    {/* Preview Button */}
                    <button
                        type="button"
                        className="rounded-btn bg-primary text-xl text-white"
                        onClick={()=> handlePreview(file)}
                        disabled={loading || !file}
                    >
                        {loading  ? (
                            <div className="flex flex-row items-center justify-center gap-x-2">
                                <HorizontalLoadingAnimation2 text="Processing"/>
                            </div>
                        ) : (
                            'Preview Questions'
                        )}
                    </button>

                    {/* Preview the questions */}
                    {status === "preview" && (
                        <section className="space-y-8">
                            {/* Preview the questions */}
                            <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                {(questions).map((q, idx) => (
                                    <div key={idx} className="px-4 py-3 space-y-1">
                                        <p className="text-sm text-slate-900">
                                            {q.text ?? q.question_preview}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Save OR Reset */}
                            <div className="flex gap-4">
                                <button type ="button" onClick={handleSaveClick} className="rounded-btn bg-primary text-white text-xl">Confirm & Save</button>
                                <button type ="button" onClick={handleDiscardClick} className="rounded-btn border-2 border-primary text-primary text-xl">Discard</button>
                            </div>
                        </section>
                    )}

                </div>

            </div>
        </>
    )
}