

import type {QuestionInfo, BaseBronzeQuestions} from "@/types/question-processing";
import {useState} from "react";
import {bulkUploadQuestions, extractQuestions} from "@/services/api.document-processing";

export default function useUploadQuestion() {

    const emptyForm: QuestionInfo = {
        section: "",
        topic: "",
        subtopic: "",
        source: ""
    }

    const [fileForm, setFileForm] = useState<QuestionInfo>(emptyForm)
    const [questions, setQuestions] = useState<BaseBronzeQuestions[]>([])
    const [error, setError] = useState("")
    const [status, setStatus] = useState<'idle' | 'processing' | 'preview' | 'saving' | 'done'>('idle')
    const [loading, setLoading] = useState(false)

    // Detects if there is a change in the form
    const fieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setFileForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Validate the form for missing information
    const validateForm = () => {
        const missing: string[] = []

        const missingFields: (keyof QuestionInfo)[] = ["section", "topic", "subtopic", "source"]
        missingFields.forEach(i => {
            if (!fileForm[i]) missing.push(i)
        })
        return missing
    }

    const handlePreview = async (file:File | null) => {
        const missing = validateForm()
        if (missing.length > 0) {
            setError(`Missing: ${missing.join(", ")}`)
            return
        }

        // Error Handling
        if (!file) {
            setError("Please upload a file.")
            return
        }

        setError("")
        setStatus("processing")
        setLoading(true)


        // Uploads a file and its information to preprocess, extracts, and organizations the SAT questions
        try {
            // Upload a file
            const form = new FormData()
            form.append('file', file)

            Object.entries(fileForm).forEach( ([key, value]) => {
                form.append(key, String(value))
            })

            // Send to backend to preprocess, extract, and organize the questions
            const response = await extractQuestions(form)
            console.log("raw questions ==>> ",  response)

            if (!Array.isArray(response)) {
                setError("Invalid response from server")
                setQuestions([])
                return
            }

            setQuestions(response)
            setStatus('preview')

            //console.log("response: ", response)
            //console.log("extracted questions: ", response.questions)

        } catch (error) {
            console.error("Failed to process the file.", error)
            setError("Failed to process the file")
            setStatus('idle')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setFileForm(emptyForm)
        setQuestions([])
        setStatus('idle')
        setLoading(false)
        setError("")
    }

    const handleSave = async () => {

        if (questions.length === 0) {
            setError("No questions to save.")
            return
        }

        // Save the questions in the bronze.raw_questions
        try {
            setStatus("saving")
            console.log("questions being sent for save: ", questions)
            await bulkUploadQuestions(questions)
            handleReset()
            return
        } catch (error) {
            console.log("Error saving the questions", error)
            setError("Failed to save questions")
            setStatus('idle')
        }
        setStatus('done')
    }
    return {fileForm, questions, error, setError, status, loading, fieldChange, handleSave, handlePreview, handleReset}
}