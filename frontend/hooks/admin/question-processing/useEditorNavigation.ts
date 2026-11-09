
"use client"

import {useState} from "react";
import type {IncomingSilverQuestions, AnyQuestion} from "@/types/question-processing"
import {updateRawQuestions} from "@/services/api.document-processing";
import { validateEditorForm } from "@/utils/admin/question-processing";
import timeEstimate from "@/utils/admin/question-processing"
import { wrapSigma } from "@/utils/latexHelpers";
import { useAuthedFetch } from "@/lib/fetchWithFreshToken";

type Props = {
    questions: AnyQuestion[]
    setQuestions: (questions:AnyQuestion[]) => void 
}



// Responsible for fetching questions, navigating and saving them to the database
export default function useEditorNavigation(
    {questions, setQuestions}: Props 
){

    // Initialize the parameters ---------------------------------------------------------------------------------------
    const [completedQuestions, setCompletedQuestions] = useState<IncomingSilverQuestions[]>([])
    const resetCompleted = () => setCompletedQuestions([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const [currentIndex, setCurrentIndex] = useState(0)
    const [processedCount, setProcessedCount] = useState(0)


    // Start over on new list (call after a new search)
    const resetNavigation = () => {
        setCurrentIndex(0)
        setCompletedQuestions([])
    }


    // Next and previous navigation ------------------------------------------------------------------------------------
    const completedIds = new Set(completedQuestions.map(q => q.question_id)) // tracks the localluy staged questions in completedQuestions
    const nextIndex = () => { // Advance to the next questions that hasnt been completed 
        //console.log("currentIndex", currentIndex)
        setCurrentIndex((prev) => {
            let next = prev + 1;
            while (next < questions.length) {
                const id = questions[next].question_id
                if (!completedIds.has(id)) return next;
                next++
            }
            return prev
        }
    )
    }
    const previousIndex = () => {
        //console.log("currentIndex", currentIndex)
        setCurrentIndex(prev => {
            let next = prev - 1
            while (next >= 0) {
                const id = questions[next].question_id
                if (!completedIds.has(id)) return next
                next--
            }
            return prev 
        })
    }


    // Save the completed questions in a List -------------------------------------------------------------------------
    const saveQuestion = async(form: IncomingSilverQuestions) => {
        setSaving(true)

        // Validate the form
        try {
            const missing = validateEditorForm(form)
            if (missing.length > 0) {
                setError(`Missing: ${missing.join(", ")}`)
                return false
            }

            // Add delimiters to equation
            const equation = form.equation?.trim() ? wrapSigma(form.equation) : form.equation;

            // Auto-set the timeEstimate to the question
            const updatedForm = {
                ...form,
                equation,
                time_estimate: timeEstimate(form.difficulty ?? ""),
                multiple_choices: form.question_type === "free response" ? null : form.multiple_choices
            }
            // console.log("completed question ==>> ", updatedForm)

            setCompletedQuestions( prev => { // Prevents duplicate staged entries for the same question 
                const withoutDupe = prev.filter(q => q.question_id !==updatedForm.question_id)
                return [...withoutDupe, updatedForm] // If you edited a staged question,, the newer version replaces the old one
            })

            setError("")
            return true
        } finally {
            //console.log("saved questions ==>> ", completedQuestions)
            setSaving(false)
        }
    }
    
    
    // Updates and Saves Questions in the dataset ------------------------------------------------------------------------
    const [isSavingBatch, setIsSavingBatch] = useState(false)
    const authedFetch = useAuthedFetch()

    const handleSave = async (saved:IncomingSilverQuestions[]) => {
        //console.log("questions being sent ==>> ", completedQuestions)
        if (saved.length === 0 || isSavingBatch) return 
        setIsSavingBatch(true)
        setError("")

        try {
            await updateRawQuestions(saved, authedFetch)

            // Update local array so that you don't navigate to completed questions by removing saved questions from the queue 
            const savedIds = new Set(saved.map(q => q.question_id))
            const remainingQuestions = questions.filter(q => !savedIds.has(q.question_id))
            setQuestions(remainingQuestions)

            // Clamp index in case we just removed the last question
            setProcessedCount(prev => prev + saved.length)

            // Stay on the same question if it still exists 
            const currentId = questions[currentIndex]?.question_id
            const newIndex = remainingQuestions.findIndex( q => q.question_id === currentId)
            setCurrentIndex(newIndex >= 0 ? newIndex : Math.max(0, Math.min(currentIndex, remainingQuestions.length-1)));
            setCompletedQuestions([]) // Clear staged questions after a successful upload
        } catch (error) {
            console.error("Unable to update and insert question.", error)
            setError("Failed to update and insert question.")
            throw error 
        } finally {
            setIsSavingBatch(false)
        }
    }


    return {
        error,setError,
        currentIndex, nextIndex, previousIndex, processedCount,
        completedQuestions, saving, saveQuestion, handleSave, 
        resetCompleted, resetNavigation
    }
}