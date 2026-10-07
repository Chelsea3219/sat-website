"use client"

import { useState } from "react"
import { useSignIn, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function GuestLoginButton() {
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

    return (
        <div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

            <button
                onClick={handleClick} 
                disabled={loading}
                className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium text-orange-500 transition duration-300 ease-out border-2 border-orange-500 rounded-full shadow-md group"
                >
                <span
                    className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-orange-500 group-hover:translate-x-0 ease"
                >
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                    </svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full uppercase text-orange-500 font-bold transition-all duration-300 transform group-hover:translate-x-full ease">
                    {loading ? "Starting demo..." : "Try the Demo"}
                </span>
                <span className="relative invisible">Explore</span>
            </button>

        </div>
    )
}