"use client"

import {useRef} from "react";


export function useEnterShortcut() {
    const editorRef = useRef<HTMLDivElement>(null)
    
    const handleEnterNext = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (e.key !== "Enter") return

        const container = editorRef.current
        if (!container) return

        const focusable = Array.from(
            container.querySelectorAll("input, textarea, select")
        ) as HTMLElement[]

        const index = focusable.indexOf(e.currentTarget as HTMLElement)
        focusable[index + 1]?.focus()
    }

    return {editorRef, handleEnterNext}
}