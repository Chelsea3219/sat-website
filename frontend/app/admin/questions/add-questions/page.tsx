"use client"


import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {useState} from "react";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import QuestionAdder from "@/components/admin/questions/QuestionAdder";
import useQuestionAdder from "@/hooks/admin/question-processing/useQuestionAdder";
import Preview from "@/components/admin/questions/ui/Preview";


const buttonClass = "rounded-xl min-w-20 py-1 text-md font-semibold border-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer "


export default function Page () {
    const [uploading, setUploading] = useState(false)
    const previewUploader = useFileUploader()
    const diagramUploader = useFileUploader()
    const [preview, setPreview] = useState(false)

    const {
        form, completedQuestions,
        error, setError,
        fieldChange, mcFieldChange, mcChangeAll, handleImageUpload, 
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

    const adminHeaderButtons = [
        {
            label:"Reset", onClick:resetForm, disabled:saving, className:`bg-red-500 hover:bg-red-500/70 border-transparent text-white ${buttonClass}`
        }, 
        {
            label:"Save", onClick:saveQuestion, disabled:saving, className:`bg-primary border-transparent hover:bg-primary/70 text-white ${buttonClass}`
        }, 
        {
            label:"Preview", onClick:handleOpenPreview, disabled:preview || completedQuestions.length===0, className:`border-green-600 bg-white text-green-600 ${buttonClass}`
        }, 
    ]

    return (
        <div className="w-full">
            
            <AdminHeader
                title="Add Questions"
                subtitle={`Completed ${completedQuestions.length} questions`}
                actions = {
                    <div className="grid grid-cols-3 gap-2">
                        {adminHeaderButtons.map((button) => (
                            <div key={button.label}>
                                <button
                                    type="button"
                                    onClick={button.onClick}
                                    disabled={button.disabled}
                                    className={button.className}
                                >
                                    {button.label}
                                </button>
                            </div>
                        ))}
                    </div>
                }
            />

            <QuestionAdder
                form={form}
                fieldChangeAction={fieldChange}
                handleImageAction={handleImageUpload}
                mcFieldChangeAction={mcFieldChange}
                mcChangeAll={mcChangeAll}
                previewUploader={previewUploader}
                diagramUploader={diagramUploader}
            />

            {error && <ErrorMessage error={error} onDismiss={()=> setError("")} fillsPage={true}/> }
            
            {preview && (
                <Preview
                    questions={completedQuestions}
                    saving={uploading}
                    onConfirm={handleConfirmSave}
                    onDismiss={handleDismiss}
                />
            )}
        </div>
    )
}