"use client"


import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {useState} from "react";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import QuestionAdder from "@/components/forms/QuestionAdder";
import useQuestionAdder from "@/hooks/admin/question-processing/useQuestionAdder";
import Preview from "@/components/forms/ui/Preview";



export default function Page () {
    const [uploading, setUploading] = useState(false)
    const previewUploader = useFileUploader()
    const diagramUploader = useFileUploader()
    const [preview, setPreview] = useState(false)

    const {
        form, completedQuestions,
        error, setError,
        fieldChange, mcFieldChange, handleImageUpload, 
        saving, saveQuestion, handleSave, resetForm
    } = useQuestionAdder(previewUploader, diagramUploader)

    // Open the preview without uploading anything
    const handleOpenPreview = () => {
        if (completedQuestions.length ===0) return 
        setError("")
        setPreview(true)
    }

    // Confirm the preview and upload the staged questions
    const handleConfirmSave = async() => {
        if (uploading || completedQuestions.length===0) return 
        setUploading(true)
        setError("")

        try {
            await handleSave(completedQuestions)
            previewUploader.resetUpload()
            diagramUploader.resetUpload()
            setPreview(false)
        } catch (error) {
            console.error("Unable to save question.", error)
            setError("Failed to save question. Please try again.")
        } finally {
            setUploading(false)
        }

    }

    // Continue the question
    const handleDismiss = () => setPreview(false) 

    const buttonStyle = "rounded-xl border-2 px-5 py-2 text-center cursor-pointer font-semibold transition-all disabled:opacity-50"

    return (
        <div className="pt-1 w-full">
            {error &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <ErrorMessage
                        error={error}
                        onDismiss={()=> setError("")}
                    />
                </div>
            }
            {preview && (
                <Preview
                    questions={completedQuestions}
                    saving={uploading}
                    onConfirm={handleConfirmSave}
                    onDismiss={handleDismiss}
                />
            )}
            

            <AdminHeader
                title="Add Questions"
                subtitle={`Completed ${completedQuestions.length} questions`}
                actions = {
                    <div className="grid grid-cols-3 gap-x-4 ">
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            className={`${buttonStyle} bg-red-500 text-white hover:bg-red-500/70`}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={saveQuestion}
                            disabled={saving}
                            className={`${buttonStyle} bg-primary text-white hover:bg-primary/70`}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenPreview}
                            disabled={completedQuestions.length===0}
                            className={`${buttonStyle} border-primary text-primary hover:bg-primary/40`}
                        >
                            Preview
                        </button>
                    </div>
                }
            />

            <QuestionAdder
                form={form}
                fieldChangeAction={fieldChange}
                handleImageAction={handleImageUpload}
                mcFieldChangeAction={mcFieldChange}
                previewUploader={previewUploader}
                diagramUploader={diagramUploader}
            />
        </div>
    )
}