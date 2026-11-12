
import { useState } from "react"
import type {IncomingSilverQuestions, AnyQuestion} from "@/types/question-processing"
import {IncomingAnswerExplanations} from "@/types/answer-explanations"
import {updateRawQuestions, updateAnswerExplanation} from "@/services/api.document-processing";
import { validateEditorForm } from "@/utils/admin/question-processing";
import { useAuthedFetch } from "@/lib/fetchWithFreshToken";


export default function useExplanationEditor(explanation: IncomingAnswerExplanations | null) {
    
    // Declare the variables
    const [explanationForm, setExplanationForm] = useState<IncomingAnswerExplanations | null>(() => explanation)
    const [activeTab, setActiveTab] = useState<"Question" | "Preview" | "Explanation">("Question")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const authedFetch = useAuthedFetch()

    // Update the explanation form when a field changes
    const explanationFieldChange = <K extends keyof IncomingAnswerExplanations>(
        field: K, 
        value: IncomingAnswerExplanations[K]
    ) => {
        setExplanationForm(prev => prev ? {...prev, [field]:value} : prev)
    }

    // Save Question
    const saveQuestion = async (question: IncomingSilverQuestions) => {
        setSaving(true)
        setError("")

        const missing = validateEditorForm(question)
        if (missing.length > 0) {
            setError(`Missing required fields: ${missing.join(", ")}`)
            return
        }

        try {
            await updateRawQuestions([question], authedFetch)
        } catch (error) {
            setError(`Failed to update question: ${error}`)
        }
        finally {
            setSaving(false)
        }
    }

    // Save Explanation
    const saveExplanation = async (explanation: IncomingAnswerExplanations) => {
        setSaving(true)
        setError("")

        try {
            await updateAnswerExplanation([explanation], authedFetch)
        } catch (error) {
            setError(`Failed to update question: ${error}`)
        }
        finally {
            setSaving(false)
        }
    }
    
    return{explanationForm, setExplanationForm, activeTab, setActiveTab, explanationFieldChange, saving, error, setError, saveExplanation, saveQuestion}
}