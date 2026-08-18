"use client"

import type {UserRegistration} from "../types/students"
import {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {registerUser} from "@/services/api.register";

export default function useRegistration() {

    const emptyForm: UserRegistration = {
        clerk_id: "",
        first_name: "",
        last_name: "",
        email: "",
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
        subscription: "free",
        referral: "", 
        learning_targets: {
            daily_goal: 0,
            weekly_goal: 0
        }
    }

    const [form, setForm] = useState<UserRegistration>(emptyForm)
    const [error, setError] = useState("")
    const router = useRouter()

    const { user, isLoaded } = useUser()

    // Protect the page from unauthenticated access
    useEffect(() => {
        if (isLoaded && !user) router.push("/")
    }, [isLoaded, user, router]);

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
                    original_score: {...prev.original_score, [name]:Number(value)}
                }
            }
            return {...prev, [name]:value }
        })
    }

    const validateForm = () => {
        const missing: string[] = []
        const missingFields = ["first_name", "last_name", "grade_level", "original_score", "dream_score", "test_date", "subscription"]
        missingFields.forEach(i => {
            if (!form[i as keyof UserRegistration]) missing.push(i)
        })
        return missing
    }

    const handleSave = async () => {
        if (!user) {
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

        // Merge in clerk_id/email right here, at submission — no need to have stored them earlier
        const payload: UserRegistration = {
            ...form,
            clerk_id: user.id,
            email: user.emailAddresses[0].emailAddress
        }
        console.log("payload", payload)

        try {
            const response = await registerUser(payload)
            console.log("registration response", response)

            if (form.subscription === "free") {
                router.push("/dashboard")
            } else {
                router.push("/dashboard/billing")
            }
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