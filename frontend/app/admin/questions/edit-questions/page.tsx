"use client"

import {useState} from "react";
import MathQuestionEditor from "@/components/forms/MathQuestionEditor";
import ReadingQuestionEditor from "@/components/forms/ReadingQuestionEditor";
import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useEditorNavigation from "@/hooks/admin/question-processing/useEditorNavigation"
import useQuestionEditor from "@/hooks/admin/question-processing/useQuestionEditor";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import Preview from "@/components/forms/ui/Preview";
import CircleLoadingAnimation from "@/components/ui/loading-animation/circleLoadingAnimation"; 
import SearchBar from "@/components/forms/ui/SearchBar"



const buttonClass = "rounded-xl min-w-20 py-1 text-md font-semibold border-2 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer "


export default function Page () {


    const {
        search, handleSearchChange, handleSearch,
        questions, numQuestions, loading, 
        error,setError,
        currentIndex, nextIndex, previousIndex,
        completedQuestions, saving, saveQuestion, handleSave, 
    } = useEditorNavigation()

    const currentQuestion = questions[currentIndex] ?? null
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    console.log("deleting", deleting)
    const diagramUploader = useFileUploader()
    const [preview, setPreview] = useState(false)
    

    const {
        form,
        fieldChange, mcFieldChange, mcChangeAll, handleImageUpload,
        handleDeleteQuestion,
    } = useQuestionEditor(currentQuestion)

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
        setDeleting(true)
        try {
            const ok = await handleDeleteQuestion(currentQuestion.question_id)
            if (!ok) {
                setError("Failed to delete question")
                return
            }
            //console.log("Deleted question with ID:", currentQuestion.question_id)
            diagramUploader.resetUpload()
            nextIndex()
        } catch (error) {
            console.error("Unable to delete question.", error)
            setError("Failed to delete question")
        } finally {
            setDeleting(false)
        }
    }

    const adminHeaderButtons = [
        {
            label:"Previous", onClick:previousIndex, disabled:currentIndex===0, className:`bg-primary border-transparent text-white ${buttonClass}`
        }, 
        {
            label:"Save", onClick:handleSaveQuestionClick, disabled:saving || !currentQuestion, className:`bg-accent border-transparent text-white ${buttonClass}`
        }, 
        {
            label:"Preview", onClick:handleOpenPreview, disabled:preview || completedQuestions.length===0, className:`border-primary bg-white text-primary ${buttonClass}`
        }, 
        {
            label:"Next", onClick:nextIndex, disabled:currentIndex === questions.length-1,  className:`bg-primary border-transparent text-white ${buttonClass}`
        }
    ]

    return (
        <div>
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
                subtitle={questions.length !== 0 ?`Question ${currentIndex+1} of ${numQuestions}` : ``}
                actions = {
                    <div className="grid grid-cols-4 gap-2">
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

            {/* Search: always visible, even when no questions match */}
            <div className="px-6 pt-20">
                <SearchBar
                    search={search}
                    searchChangeAction={handleSearchChange}
                    handleSearchAction={handleSearch}
                />
            </div>

            {questions.length === 0 && !loading &&
                <div className="flex items-center justify-center pt-10">
                    <p>No more questions. Try a different search parameters. </p>
                </div>
            }

            {loading ? (
                <div className="flex items-center justify-center pt-10">
                    <CircleLoadingAnimation/>
                </div>

            ) : (
                    form.section === "math" ? (
                        <MathQuestionEditor
                            form={form}
                            fieldChangeAction={fieldChange}
                            mcFieldChangeAction={mcFieldChange}
                            mcChangeAll={mcChangeAll}
                            handleImageAction = {handleImageUpload}
                            diagramUploader={diagramUploader}
                            onDeleteAction={handleDeleteQuestionClick}
                            deleting={deleting}
                        />
                    ) : (
                        <ReadingQuestionEditor
                            form={form}
                            fieldChangeAction={fieldChange}
                            mcFieldChangeAction={mcFieldChange}
                            mcChangeAll={mcChangeAll}
                            handleImageAction = {handleImageUpload}
                            diagramUploader={diagramUploader}
                            onDeleteAction={handleDeleteQuestionClick}
                            deleting={deleting}
                        />
                    )
                )
            }
        </div>
    )
}

