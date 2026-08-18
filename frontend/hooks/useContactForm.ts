"use client"

import { useState } from "react"
import {uploadContactForm} from "@/services/api.marketing"
import {useRouter} from "next/navigation";


type ContactFormProps = {
    full_name: string
    email: string
    role: "student" | "parent" | "teacher" | null 
    subject: "general inquiry" | "billing/subscription" | "courses" | "web design" | "other" | null 
    message: string
}

export default function useContactForm() {

    const router = useRouter()

    // Initialize the variables
    const [contactForm, setContactForm] = useState<ContactFormProps>({
        full_name: "",
        email: "",
        role: null,
        subject: null, 
        message: ""
    })
    const [error, setError] = useState("")

    // Update the form field
    const fieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setContactForm(prev => ({ ...prev, [name]: value }))
    }

    // Validate the contactForm
    const validateForm = () => {
        const missing: string[] = []
        const missingFields = ["full_name", "email", "role", "subject", "message"]
        missingFields.forEach(i => {
            if (!contactForm[i as keyof ContactFormProps]) missing.push(i)
        })
        return missing
    }

    // Upload the contactForm 
    const uploadForm = async (contactForm:ContactFormProps) => {

        const missing = validateForm()
        if (missing.length > 0) {
            setError(`Missing: ${missing.join(", ")}`)
            return
        }

        // Makes sure that the email is in the correct format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(contactForm.email)) {
            setError("Please enter a valid email address.")
            return
        }

        //console.log("contact form before upload:", contactForm)

        try {
            const response = await uploadContactForm(contactForm)
            //console.log("contact form after upload:", response)

            // After message is successfully sent, the user will be redirected to the homepage
            router.push("/")

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("error: ", err.message)
                setError(err.message)
            } else {
                console.error("error: ", String(err))
                setError("Something went wrong while sending your message. Try again later.")
            }
        }
    }

    return {contactForm, fieldChange,uploadForm, error, setError}
}