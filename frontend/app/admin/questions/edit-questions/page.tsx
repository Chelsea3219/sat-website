"use client"

import {useState} from "react";
import QuestionEditor from "@/components/forms/QuestionEditor";
import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useEditorNavigation from "@/hooks/admin/question-processing/useEditorNavigation"
import useQuestionEditor from "@/hooks/admin/question-processing/useQuestionEditor";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"


export default function Page () {

    const {
        search, handleSearchChange, handleSearch,
        questions, numQuestions,
        error,setError,
        currentIndex, nextIndex, previousIndex, processedCount,
        completedQuestions, saving, saveQuestion, handleSave
    } = useEditorNavigation()

    const currentQuestion = questions[currentIndex] ?? null
    const [uploading, setUploading] = useState(false)
    const diagramUploader = useFileUploader()
    const [savedKey, setSavedKey] = useState(0)

    const {
        form, resetForm,
        fieldChange, mcFieldChange, handleImageUpload,
    } = useQuestionEditor(currentQuestion, savedKey)

    // Save one question into the queue
    const handleSaveQuestionClick = async () => {
        try{
            saveQuestion(form)
        } finally{
            diagramUploader.resetUpload()
            resetForm()
            nextIndex()
        }
    }
    
    // Upload Questions to the db
    const handleSaveClick = async () => {
        setUploading(true)
        try {
            await handleSave(completedQuestions)
            setSavedKey(prev => prev + 1)
            diagramUploader.resetUpload()
        } catch (error) {
            console.error("Unable to save question.", error)
            setError("Failed to save question")
        } finally {
            setUploading(false)
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

            <AdminHeader
                title="Edit Questions"
                subtitle={`Question ${processedCount+1} of ${numQuestions}`}
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
                            onClick={handleSaveClick}
                            disabled={uploading || completedQuestions.length===0}
                            className="min-w-25 rounded-btn bg-primary text-white "
                        >
                            {uploading ? "Uploading" : "Upload"}
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
                />
           )
           }
       </div>
    )
}

