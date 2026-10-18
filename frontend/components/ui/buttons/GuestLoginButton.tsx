"use client"

import useDemoButton from "@/hooks/useDemoButton"



export default function GuestLoginButton() {

    const {error, loading, handleClick } = useDemoButton()

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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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