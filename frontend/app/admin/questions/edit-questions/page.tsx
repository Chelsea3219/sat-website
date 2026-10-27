"use client"

import {useState} from "react";
import QuestionEditor from "@/components/forms/QuestionEditor";
import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useEditorNavigation from "@/hooks/admin/question-processing/useEditorNavigation"
import useQuestionEditor from "@/hooks/admin/question-processing/useQuestionEditor";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import Preview from "@/components/forms/ui/Preview";

export default function Page () {

    const {
        search, handleSearchChange, handleSearch,
        questions, numQuestions,
        error,setError,
        currentIndex, nextIndex, previousIndex, processedCount,
        completedQuestions, saving, saveQuestion, handleSave, 
        resetCompleted
    } = useEditorNavigation()

    const currentQuestion = questions[currentIndex] ?? null
    const [uploading, setUploading] = useState(false)
    const diagramUploader = useFileUploader()
    const [savedKey, setSavedKey] = useState(0)
    const [preview, setPreview] = useState(false)

    const {
        form, resetForm,
        fieldChange, mcFieldChange, handleImageUpload,
        handleDeleteQuestion,
    } = useQuestionEditor(currentQuestion, savedKey)

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
            setPreview(false)
        } catch (error) {
            console.error("Unable to save question.", error)
            setError("Failed to save question. Please try again.")
            return false 
        } finally {
            setUploading(false)
        }

    }

    // Continue the question
    const handleDismiss = () => setPreview(false) 

    // Save one question into the queue
    const handleSaveQuestionClick = async () => {
        try{
            const ok = await saveQuestion(form)
            if (!ok) return
            diagramUploader.resetUpload()
            nextIndex()
        } finally{
            diagramUploader.resetUpload()
        }
    }
    

    const handleDeleteQuestionClick = async () => {
        if (!currentQuestion) return
        try {
            const ok = await handleDeleteQuestion(currentQuestion.question_id)
            if (!ok) {
                setError("Failed to delete question")
                return
            }
            console.log("Deleted question with ID:", currentQuestion.question_id)
            diagramUploader.resetUpload()
            nextIndex()
        } catch (error) {
            console.error("Unable to delete question.", error)
            setError("Failed to delete question")
        }
    }

    return (
        <div className = "pt-4">
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
                title="Edit Questions"
                subtitle={`Question ${currentIndex+1} of ${numQuestions}`}
                actions = {
                    <div className="flex items-center flex-row gap-x-2 ">
                        <button
                            type="button"
                            onClick={previousIndex}
                            disabled={currentIndex===0}
                            className="min-w-25 rounded-btn bg-primary text-white "
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveQuestionClick}
                            disabled={saving || !currentQuestion}
                            className="min-w-25 rounded-btn bg-accent text-white "
                        >
                            {saving ? "Saving" : "Save"}
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenPreview}
                            disabled={preview || completedQuestions.length===0}
                            className="min-w-25 rounded-btn bg-primary text-white "
                        >
                            Preview
                        </button>

                        <button
                            type="button"
                            onClick={nextIndex}
                            disabled={currentIndex === questions.length-1}
                            className="min-w-25 rounded-btn bg-primary text-white "
                        >
                            Next
                        </button>
                    </div>
                }
            />

           {questions.length === 0 ? (

               <div className="flex items-center justify-center pt-14">
                   <div className=" text-primary text-3xl font-semibold uppercase">
                       No questions to displayed
                   </div>
               </div>

           ) : (
               <QuestionEditor
                    form={form}
                    fieldChangeAction={fieldChange}
                    mcFieldChangeAction={mcFieldChange}
                    search={search}
                    searchChangeAction={handleSearchChange}
                    handleSearchAction={handleSearch}
                    handleImageAction = {handleImageUpload}
                    diagramUploader={diagramUploader}
                    onDeleteAction={handleDeleteQuestionClick}
                />
           )
           }
       </div>
    )
}

