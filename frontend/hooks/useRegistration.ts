"use client"

import type {StudentInfo} from "../types/students"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {registerUser} from "@/services/api.register";
import {useUserInformationContext} from "@/contexts/StudentInformationContext"



export default function useRegistration() {

    const emptyForm: StudentInfo = {
        school: "",
        state: "",
        grade_level: "",
        original_score: {
            original_score: 0,
            reading_score: 0,
            math_score:0
        },
        dream_score: 0,
        test_date: "",
        learning_targets: {
            daily_goal: 0,
            weekly_goal: 0
        }, 

        referral:""
    }

    const {isProfileIncomplete, isLoaded, isSignedIn, isFetched, refresh} = useUserInformationContext()

    const [form, setForm] = useState<StudentInfo>(emptyForm)
    const [error, setError] = useState("")
    const router = useRouter()

    // Protect the page from unauthenticated access
    useEffect(() => {
        if (isLoaded  && !isSignedIn) {router.replace("/sign-in"); return}
        if (isFetched && !isProfileIncomplete) router.replace("/dashboard")
    }, [isLoaded, isFetched, router, isProfileIncomplete, isSignedIn]);

    // TODO think of another way to check for success or to allow access when there is an incomplete profile


    // Update the form field
    const scoreFields = new Set(["original_score", "reading_score", "math_score"])
    const targetFields = new Set(["daily_goal", "weekly_goal"])
    const fieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setForm(prev => {
            if (scoreFields.has(name)) {
                return {
                    ...prev,
                    original_score: {...prev.original_score, [name]:Number(value)}
                }
            }

            if (targetFields.has(name)) {
                return {
                    ...prev, 
                    learning_targets: {...prev.learning_targets, [name]:Number(value)}
                }
            }
            return {...prev, [name]:value }
        })
    }

    const validateForm = () => {
        const missing: string[] = []
        const missingFields = ["grade_level", "dream_score", "test_date"]
        missingFields.forEach(i => {
            if (!form[i as keyof StudentInfo]) missing.push(i)
        })
        return missing
    }

    const handleSave = async () => {
        if (!isSignedIn) {
            setError("You must be signed in to register.")
            return
        }

        const missing = validateForm()
        if (missing.length > 0) {
            setError(`Missing: ${missing.join(", ")}`)
            return
        }

        if (form.original_score.original_score < 400 || form.original_score.original_score > 1600) {
            setError("Current Score must be between 400 and 1600")
            return
        }
        if (form.dream_score < 400 || form.dream_score > 1600) {
            setError("Dream Score must be between 400 and 1600")
            return
        }
        if (form.original_score.reading_score < 200 || form.original_score.reading_score > 800) {
            setError("Reading Score must be between 200 and 800")
            return
        }
        if (form.original_score.math_score < 200 || form.original_score.math_score > 800) {
            setError("Math Score must be between 200 and 800")
            return
        }

        try {
            await registerUser({...form})
            //console.log("registration response", response)
            await refresh()
            router.replace("/dashboard")

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("error: ", err.message)
                setError(err.message)
            } else {
                console.error("error: ", String(err))
                setError("Something went wrong while saving your registration.")
            }
        }
    }

    return {
        form, error, setError,
        fieldChange, handleSave
    }
}