"use client"

import { useState } from "react"
import { useSignIn, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"


export default function useDemoButton() {
    const { signIn } = useSignIn()
    const { isSignedIn } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleClick = async () => {
        // Already signed in (as guest or yourself) → just go to the dashboard
        if (isSignedIn) return router.push("/dashboard")
        if (!signIn) return

        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/guest-login", { method: "POST" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            const { error } = await signIn.ticket({ ticket: data.token })
            if (error) throw new Error("Sign-in failed")

            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: async ({ decorateUrl }) => {
                        const url = decorateUrl("/dashboard")
                        if (url.startsWith("http")) window.location.href = url
                        else router.push(url)
                    },
                })
            }
        } catch (err) {
            console.error(err)
            setError("Couldn't start the demo. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    
    return {loading, error, handleClick}
}