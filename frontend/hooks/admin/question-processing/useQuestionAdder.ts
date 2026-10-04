"use client"


import {useState} from "react";
import type {IncomingSilverQuestions, ImageCategory, MCProps, UseFileUploaderReturn} from "@/types/question-processing";
import {addQuestions, uploadQuestionImage} from "@/services/api.document-processing";
import timeEstimate from "@/utils/question-processing";


{/* RESPONSIBILITIES
    - initializing the form
    - updates the form based on fieldChange and mcFieldChange
    - uploads the question_preview and diagram
    - saves the questions in the bronze and silver layer
*/}
export default function useQuestionAdder(
    previewUploader: UseFileUploaderReturn,
    diagramUploader: UseFileUploaderReturn
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
        text: "",
        equation: "",
        diagram: "",
        multiple_choices: {
            A: "", B: "", C: "", D:""
        },
        answer_key: "",
        source: ""
    }
    const [form, setForm] = useState<IncomingSilverQuestions>(emptyForm)
    const [completedForm, setCompletedForm] = useState<IncomingSilverQuestions[]>([])
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)


    // Handles the field change in QuestionEditor ----------------------------------------------------------------------
    const fieldChange = <K extends keyof IncomingSilverQuestions>(
        field: K, 
        value: IncomingSilverQuestions[K]
    ) => {
        setForm( prev => prev ? {...prev, [field]: value} : prev)
    }


    // Handles the MC field change --------------------------------------------------------------------------------------
    const mcFieldChange = (letter: keyof MCProps, value: string) => {
        const currentMC = form.multiple_choices ?? {A:"", B:"", C:"", D:""}
        const updatedMC: MCProps = {...currentMC, [letter]:value}
        fieldChange("multiple_choices", updatedMC)
    }


    // Function to save the completedQuestion to the array so that you move onto the next question
    const saveQuestion = async () => {
        setSaving(true)

        // Validate the form
        if (!form) {
            setSaving(false)
            return
        }
        const missing = validateForm()
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
        const updatedForm = {
            ...form,
            time_estimate:timeEstimate(form.difficulty ?? "")
        }

        // Add the completedQuestion to the array
        const updatedArray = [...completedForm, updatedForm]
        console.log("saved questions ==>> ", updatedArray)
        setCompletedForm(updatedArray)
        setSaving(false)
        previewUploader.resetUpload()
        diagramUploader.resetUpload()
        setForm(emptyForm)
    }


    // Handles the Image Upload ----------------------------------------------------------------------------------------
    const handleImageUpload = async (image:File, category:ImageCategory) => {

        console.log("form at upload time:", {
            section: form.section,
            topic: form.topic,
            subtopic: form.subtopic,
        })

        try {
            const response = await uploadQuestionImage(image,category, form)
            fieldChange(category, response.url)
        } catch (error) {
            console.error("Unable to upload the image to Cloudinary. ", error )
            return ("Failed to upload the image to Cloudinary.")
        }
    }


    // Validate the form for missing information -----------------------------------------------------------------------
    const validateForm = () => {
        const missing: string[] = []

        const missingFields: (keyof IncomingSilverQuestions)[] = ["section", "topic", "subtopic", "difficulty", "question_type", "text", "answer_key"]
        missingFields.forEach(i => {
            if (!form[i]) missing.push(i)
        })

        //console.log("missing", missing)
        return missing
    }


     // Saves the question in the bronze.raw_questions and silver.clean_questions
    const handleSave = async(completedForm: IncomingSilverQuestions[]) => {

        try{
            //console.log("response sent to the backend:", completedForm)
            await addQuestions(completedForm)
        } catch (error) {
            console.error("Unable to update and insert question.", error)
            setError("Failed to update and insert question.")
            throw error
        }
    }


    // Resets the form
    const resetForm = () => {
        setForm(emptyForm)
    }

    return {
        form, completedForm,
        error, setError,
        fieldChange, mcFieldChange, validateForm, handleImageUpload, 
        saving, saveQuestion, handleSave, resetForm
    }
}