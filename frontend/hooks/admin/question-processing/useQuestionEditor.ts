
"use client"

import {useState} from "react";
import type {IncomingSilverQuestions, IncomingBronzeQuestions, MCProps } from "@/types/question-processing";
import {deleteQuestion, uploadQuestionImage} from "@/services/api.document-processing";
import { preprocessForm} from "@/utils/admin/question-processing";



export default function useQuestionEditor(
    currentQuestion: IncomingBronzeQuestions | null,
){

    // Initialize the parameters ---------------------------------------------------------------------------------------
    const emptyForm: IncomingSilverQuestions = {
        question_id: "",
        section: "",
        topic: "",
        subtopic: [""],
        difficulty: "",
        time_estimate: 0,
        question_type: "",
        question_preview: "",
        mc_preview: "",
        reading_question:"",
        text: "",
        equation: "",
        diagram: "",
        multiple_choices: {
            A: "", B: "", C: "", D:""
        },
        answer_key: "",
    }
    const [form, setForm] = useState<IncomingSilverQuestions>(emptyForm)

    // Track what (currentIndex, savedKey) the form was last synced to. -------------------------------------------------
    const [syncedKey, setSyncedKey] = useState<string | null>(null)
    const resetKey = currentQuestion?.question_id ?? "none"
    // Adjust state during render instead of in an Effect: avoids the extra
    // commit-then-recommit cycle an Effect would cause here.
    if (resetKey !== syncedKey) {
        setSyncedKey(resetKey)
        setForm(currentQuestion ? preprocessForm(currentQuestion) : emptyForm)
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

    const resetForm = () => setForm(emptyForm)

    return {form, fieldChange, mcFieldChange, mcChangeAll, handleImageUpload, resetForm, handleDeleteQuestion}
}