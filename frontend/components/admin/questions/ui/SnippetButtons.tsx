"use client"
import { useState } from "react"

const SNIPPETS = [
    { label: "∑", text: String.raw`\(\)` },
    { label: "{ }", text: "{}" },
    { label: "{", text: String.raw`\(\begin{cases}  \\  \end{cases}\)` },
    { label: "½", text: String.raw`\frac{}{}` },
]

export default function SnippetButtons() {
    const [copied, setCopied] = useState("")

    const copy = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(""), 1000)
    }

    return (
        <div className="flex gap-2">
            {SNIPPETS.map(s => (
                <button
                    key={s.text}
                    type="button"
                    onClick={() => copy(s.text)}
                    className="w-9 h-8 border rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-primary/20 transition-all"
                >
                    {copied === s.text ? "✓" : s.label}
                </button>
            ))}
        </div>
    )
}