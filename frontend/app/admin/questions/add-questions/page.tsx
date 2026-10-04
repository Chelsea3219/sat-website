"use client"


import AdminHeader from "@/components/navigation/AdminHeader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {useState} from "react";
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import QuestionAdder from "@/components/forms/QuestionAdder";
import useQuestionAdder from "@/hooks/admin/question-processing/useQuestionAdder";


export default function Page () {
    const [uploading, setUploading] = useState(false)
    const previewUploader = useFileUploader()
    const diagramUploader = useFileUploader()


    const {
        form, completedForm,
        error, setError,
        fieldChange, mcFieldChange, handleImageUpload, 
        saving, saveQuestion, handleSave, resetForm
    } = useQuestionAdder(previewUploader, diagramUploader)

    const handleSaveClick = async() => {
        setUploading(true)
        if (!completedForm) return 
        try {
            await handleSave(completedForm)
            previewUploader.resetUpload()
            diagramUploader.resetUpload()
            resetForm()
        } finally {
            setUploading(false)
        }
    }

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

            <AdminHeader
                title="Add Questions"
                actions = {
                    <div className="flex items-center flex-row gap-x-2 ">
                        <button
                            type="button"
                            onClick={saveQuestion}
                            disabled={saving}
                            className="min-w-25 rounded-btn bg-accent text-white "
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            disabled={uploading}
                            className="min-w-25 rounded-btn bg-primary text-white "
                        >
                            {uploading ? "Uploading..." : "Upload"}
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