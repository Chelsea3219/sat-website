"use client"
import { useCallback, useEffect, useState } from "react";
import { useAuthedFetch } from "@/lib/fetchWithFreshToken";
import { searchQuestions } from "@/services/api.document-processing";
import { SearchParameters } from "@/types/question-processing";
import { AnyQuestion } from "@/types/question-processing";

type Props = {
    reviewed: boolean
    loadOnMount?: boolean
}
const EMPTY_FILTERS = { question_id: "", section: "", topic: "", subtopic: "", text: "", source: "" }



export default function useQuestionSearch({reviewed, loadOnMount = false}: Props ) {

    // Initialize the parameters
    const [search, setSearch] = useState<SearchParameters>({...EMPTY_FILTERS, reviewed})
    const [questions, setQuestions] = useState<AnyQuestion[]>([])
    const [searchError, setSearchError] = useState("")
    const [loading, setLoading] = useState(loadOnMount)
    const [hasSearched, setHasSearched] = useState(false)


    // Handle the change in searchField  -------------------------------------------------------------------------------
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setSearch(prev => ({...prev, [name]: value }))
    }


    // Fetches questions based on search parameters ---------------------------------------------------------------------
    const authedFetch = useAuthedFetch() // Refreshes the authenticated tokens
    const runSearch = useCallback(async (params:SearchParameters) => { // useCallback memoizes (caches) a function definition between re-renders
        setSearchError("")
        setLoading(true)
        try {
            setQuestions( await searchQuestions(params, authedFetch) )
            return true
        } catch (error) {
            console.error("Unable to fetch questions based on search parameters ", error)
            setSearchError("Failed to fetch questions.")
        } finally {
            setLoading(false)
            setHasSearched(true)
        }
    }, [authedFetch])


    // Search Button -------------------------------------------------------------------------------------------------------
    const handleSearch = async() => {
        const {reviewed: _reviewed, ...filters} = search
        if (!Object.values(filters).some(v => String(v).trim())) {
            setSearchError("Please enter or select a condition")
            return false
        }
        return runSearch(search)
    }

    // Optional Initial load (unreviewed questions from the bronze table)
    useEffect(() => {
        if (!loadOnMount) return
        let ignore = false // Handles the component unmounting/the effect re-running before the request finishes
        searchQuestions({...EMPTY_FILTERS, reviewed}, authedFetch)
            .then((data) => {if (!ignore) setQuestions(data)})
            .catch( () => { if (!ignore) setSearchError("Failed to fetch questions.")})
            .finally( () => { if (!ignore) { setLoading(false); setHasSearched(true)}})
        return () => {ignore = true}
    }, [loadOnMount, reviewed, authedFetch])


    return {search, hasSearched, handleSearchChange, handleSearch, questions, setQuestions, searchError, setSearchError, loading}
}