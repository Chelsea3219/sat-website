import { Fragment, ReactNode } from "react"

export function renderFormattedText(text: string): ReactNode {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)

    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <Fragment key={i}>{part}</Fragment>
    })
}