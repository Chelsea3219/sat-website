
"use client"

import {useState} from "react";
import type {IncomingSilverQuestions, IncomingBronzeQuestions, MCProps, AnyQuestion} from "@/types/question-processing";
import {deleteQuestion, uploadQuestionImage} from "@/services/api.document-processing";
import { preprocessForm} from "@/utils/admin/question-processing";



// Module level: created once
const EMPTY_MC: MCProps = { A: "", B: "", C: "", D: "" }
const EMPTY_FORM: IncomingSilverQuestions = {
    question_id: "",
    section: "",
    topic: "",
    subtopic: [],                 // [] not [""]: an empty string would show up as a blank chip
    difficulty: "",
    time_estimate: 0,
    question_type: "",
    question_preview: "",
    mc_preview: "",
    reading_question: "",
    text: "",
    equation: "",
    diagram: "",
    multiple_choices: EMPTY_MC,
    answer_key: "",
}

// Type guard: `reviewed` only exists on bronze rows
const isBronze = (q: AnyQuestion): q is IncomingBronzeQuestions => "reviewed" in q

// Convert either kind of question into the form shape
const toForm = (q: AnyQuestion | null | undefined): IncomingSilverQuestions => {
    if (!q) return EMPTY_FORM
    if (isBronze(q)) return preprocessForm(q)
    return {
        ...EMPTY_FORM,                              // fill any missing optional fields
        ...q,
        subtopic: q.subtopic ?? [],
        multiple_choices: q.multiple_choices ?? EMPTY_MC,
    }
}



export default function useQuestionEditor(
    currentQuestion: AnyQuestion | null,
){
    const [form, setForm] = useState<IncomingSilverQuestions>(() => toForm(currentQuestion))

    // Resync the form when a different question is selected (adjusting state during render)
    const [syncedKey, setSyncedKey] = useState<string | null>(currentQuestion?.question_id ?? null)
    const resetKey = currentQuestion?.question_id ?? null
    if (resetKey !== syncedKey) {
        setSyncedKey(resetKey)
        setForm(toForm(currentQuestion))
    }


    // Handles the field change in QuestionEditor ----------------------------------------------------------------------
    const fieldChange = <K extends keyof IncomingSilverQuestions>(
        field: K, 
        value: IncomingSilverQuestions[K]
    ) => {
        setForm(prev => prev ? {...prev, [field]: value } : prev)
    }


    // Handles the MC field change -------------------------------------------------------------------------------------
    const mcFieldChange = (letter: keyof MCProps, value: string) => {
        setForm(prev => ({
            ...prev,
            multiple_choices: {
                ...(prev.multiple_choices ?? { A: "", B: "", C: "", D: "" }),
                [letter]: value,
            },
        }))
    }
    // Replace all four MC choices at once
    const mcChangeAll = (mc: MCProps) => fieldChange("multiple_choices", mc)

    // Handles the Image Upload ----------------------------------------------------------------------------------------
    const handleImageUpload = async (diagram:File) => {
        try {
            const category = "diagram"
            const response = await uploadQuestionImage(diagram,category, form)
            fieldChange("diagram", response.url)
        } catch (error) {
            console.error("Unable to upload the image to Cloudinary.", error)
            return ("Failed to upload the image to Cloudinary.")
        }
    }

    const handleDeleteQuestion = async (question_id: string) => {
        try {
            await deleteQuestion(question_id)
            return true
        } catch (error) {
            console.error("Unable to delete the question.", error)
            return false
        }
    }

    const resetForm = () => setForm(EMPTY_FORM)

    return {form, fieldChange, mcFieldChange, mcChangeAll, handleImageUpload, resetForm, handleDeleteQuestion}
}