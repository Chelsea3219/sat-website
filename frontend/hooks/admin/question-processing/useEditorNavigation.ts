
"use client"

import {useState, useEffect} from "react";
import type {IncomingSilverQuestions, IncomingBronzeQuestions, SearchFilters, QuestionSearchParameters} from "@/types/question-processing"
import {fetchRawQuestions, updateRawQuestions} from "@/services/api.document-processing";
import { validateEditorForm } from "@/utils/question-processing";
import timeEstimate from "@/utils/question-processing"
import { wrapSigma } from "@/utils/latexHelpers";



// Responsible for fetching questions, navigating and saving them to the database
export default function useEditorNavigation(){

    // Initialize the parameters ---------------------------------------------------------------------------------------
    const emptySearchForm : SearchFilters = { section:"", topic:"", subtopic:"", source:""}
    const [search, setSearch] = useState<SearchFilters>(emptySearchForm)

    const [questions, setQuestions] = useState<IncomingBronzeQuestions[]>([])
    const numQuestions = questions.length 
    const [completedQuestions, setCompletedQuestions] = useState<IncomingSilverQuestions[]>([])
    const resetCompleted = () => setCompletedQuestions([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const [currentIndex, setCurrentIndex] = useState(0)
    const [processedCount, setProcessedCount] = useState(0)
    const [loading, setLoading] = useState(true)


    // Automatically fetches the questions from the bronze.raw_questions -----------------------------------------------
    useEffect( () => {
        let ignore = false;

        ( async () => {
            setLoading(true)
            try {
                const searchParams : SearchFilters = emptySearchForm
                const data = await fetchRawQuestions(searchParams)
                if (!ignore) {
                    setQuestions(data)
                }

            } catch (error) {
                console.error("Unable to fetch questions.", error)
                if (!ignore) setError("Failed to fetch questions.")
            } finally {
                if (!ignore) setLoading(false)
            }
        })()

        return () => {
            ignore = true 
        }
    }, []);


    // Handle the change in searchField  -------------------------------------------------------------------------------
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setSearch(prev => ({...prev, [name]: value }))
    }


    // Fetches the questions from the bronze.raw_questions --------------------------------------------------------------
    const handleSearch = async() => {
        console.log("search", search)

        if (!search) {
            setError("Please enter or select a condition.")
            return
        }

        setError("")
        setLoading(true)

        try {
            // Identify the search parameters
            const searchParams: SearchFilters = {
                section: search.section?.trim() || undefined, 
                topic: search.topic?.trim() || undefined, 
                subtopic: search.subtopic?.trim() || undefined, 
                source: search.source?.trim() || undefined 
            }
            const data = await fetchRawQuestions(searchParams)
            //console.log("backend data by filter: ", data)

            if (!Array.isArray(data)) {
                setError("Unexpected response from server.")
                return
            }

            setQuestions(data)
            setCurrentIndex(0)
            setCompletedQuestions([])
            setSearch(emptySearchForm)
        } catch (error) {
            console.error("Unable to fetch questions.", error)
            setError("Failed to fetch questions.")
        } finally {
            setLoading(false)
        }
    }


    // Next and previous navigation ------------------------------------------------------------------------------------
    const completedIds = new Set(completedQuestions.map(q => q.question_id)) // tracks the localluy staged questions in completedQuestions
    const nextIndex = () => { // Advance to the next questions that hasnt been completed 
        console.log("currentIndex", currentIndex)
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
        console.log("currentIndex", currentIndex)
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
            if (!form.question_preview) {
                setError("Missing: question preview")
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
    const handleSave = async (saved:IncomingSilverQuestions[]) => {
        //console.log("questions being sent ==>> ", completedQuestions)

        if (saved.length === 0 || isSavingBatch) return 
        
        setIsSavingBatch(true)
        setError("")

        try {
            await updateRawQuestions(saved)

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
        search, handleSearchChange, handleSearch,
        questions, numQuestions,
        error,setError, loading,
        currentIndex, nextIndex, previousIndex, processedCount,
        completedQuestions, saving, saveQuestion, handleSave, 
        resetCompleted
    }
}