
"use client"

import {useState, useEffect} from "react";
import type {IncomingSilverQuestions, IncomingBronzeQuestions, QuestionSearchParameters, SearchProps} from "@/types/question-processing"
import {fetchRawQuestions, updateRawQuestions} from "@/services/api.document-processing";
import { validateEditorForm } from "@/utils/question-processing";
import timeEstimate from "@/utils/question-processing"


// Responsible for fetching questions, navigating and saving them to the database
export default function useEditorNavigation(){

    // Initialize the parameters ---------------------------------------------------------------------------------------
    const emptySearch: SearchProps = { searchName: "", searchValue:""}
    const [search, setSearch] = useState<SearchProps>(emptySearch)

    const [questions, setQuestions] = useState<IncomingBronzeQuestions[]>([])
    const [numQuestions, setNumQuestions] = useState(0)

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
                const searchParams : QuestionSearchParameters = {section: "", topic: "", subtopic: ""}
                const data = await fetchRawQuestions(searchParams)
                if (!ignore) {
                    setQuestions(data)
                    setNumQuestions(data.length)
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
        if (!search.searchName && !search.searchValue) {
            setError("Please select a filter and enter a search value.")
            return
        }

        setError("")
        setLoading(true)

        try {
            const section = search.searchName === "section" ? search.searchValue: undefined
            const topic = search.searchName === "topic" ? search.searchValue: undefined
            const subtopic = search.searchName === "subtopic" ? search.searchValue: undefined

            const searchParams : QuestionSearchParameters = {section: section, topic: topic, subtopic: subtopic}
            const data = await fetchRawQuestions(searchParams)
            //console.log("backend data by filter: ", data)

            if (!Array.isArray(data)) {
                setError("Unexpected response from server.")
                return
            }
            setQuestions(data)
            setNumQuestions(data.length)
        } catch (error) {
            console.error("Unable to fetch questions.", error)
            setError("Failed to fetch questions.")
        } finally {
            setLoading(false)
        }
        // Resets the search bar
        setSearch(emptySearch)
    }


    // Next and previous navigation ------------------------------------------------------------------------------------
    const completedIds = new Set(completedQuestions.map(q => q.question_id))
    const nextIndex = () => {
        setCurrentIndex(prev => {
            let idx = prev
            while (idx < questions.length - 1 && completedIds.has(questions[idx + 1]?.question_id)) {
                idx++
            }
            return Math.min(idx + 1, questions.length - 1)
        })
    }
    const previousIndex = () => {
        setCurrentIndex(prev => {
            let idx = prev
            while (idx > 0 && completedIds.has(questions[idx - 1]?.question_id)) {
                idx--
            }
            return Math.max(idx - 1, 0)
        })
    }


    // Save the completed questions into a List -------------------------------------------------------------------------
    const saveQuestion = async(form: IncomingSilverQuestions) => {
        setSaving(true)

        // Validate the form
        try {
            const missing = validateEditorForm(form)
            if (missing.length > 0) {
                setError(`Missing: ${missing.join(", ")}`)
                setSaving(false)
                return
            }
            if (!form.question_preview) {
                setError("Missing: question preview")
                setSaving(false)
                return
            }
            // Auto-set the timeEstimate to the question
            const time = timeEstimate(form.difficulty ?? "")
            const updatedForm = {
                ...form,
                time_estimate:time,
                multiple_choices: form.question_type === "free response" ? null : form.multiple_choices
            }
            setCompletedQuestions( prev => {
                const withoutDupe = prev.filter(q => q.question_id !==updatedForm.question_id)
                return [...withoutDupe, updatedForm]
            })
            setError("")
            return true
        } finally {
            //console.log("saved questions ==>> ", completedQuestions)
            setSaving(false)
        }
    }
    
    
    // Updates and Saves Questions in the dataset ------------------------------------------------------------------------
    const handleSave = async (saved:IncomingSilverQuestions[]) => {
        //console.log("questions being sent ==>> ", completedQuestions)

        if (saved.length === 0) return 
        try {
            await updateRawQuestions(saved)

            // Update local array so that you don't navigate to completed questions
            const currentId = questions[currentIndex]?.question_id
            const savedIds = new Set(saved.map(q => q.question_id))
            const updatedQuestions = questions.filter(q => !savedIds.has(q.question_id))
            setQuestions(updatedQuestions)

            // Stay on the same question if it still exists 
            const sameIdx = updatedQuestions.findIndex(q => q.question_id === currentId)
            setCurrentIndex(sameIdx >- 0 ? sameIdx : Math.max(0, Math.min(currentIndex, updatedQuestions.length - 1)))

            // Clamp index in case we just removed the last question
            // Maybe delete setCurrentIndex(prev => Math.max(0, Math.min(prev, updatedQuestions.length - 1)))
            setProcessedCount(prev => prev + saved.length)
            setCompletedQuestions([])
            setError("")
        } catch (error) {
            console.error("Unable to update and insert question.", error)
            setError("Failed to update and insert question.")
            throw error
        }
    }


    return {
        search, handleSearchChange, handleSearch,
        questions, numQuestions,
        error,setError, loading,
        currentIndex, nextIndex, previousIndex, processedCount,
        completedQuestions, saving, saveQuestion, handleSave
    }
}