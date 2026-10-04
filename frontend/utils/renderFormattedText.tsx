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


export function capitalizeFirstLetter(str: string): string {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1))


export function formatMinutes(totalSeconds: number, hasUnits: boolean): string {
    const totalMinutes = Math.floor(totalSeconds / 60)

    if (totalMinutes < 60) {
        return hasUnits ? `${totalMinutes}m` : `${totalMinutes}`
    }

    const hours = Math.floor(totalMinutes / 60)
    const leftoverMinutes = totalMinutes % 60

    if (leftoverMinutes === 0) {
        return hasUnits ? `${hours} h` : `${hours}`
    }
    return hasUnits ? `${hours}h ${leftoverMinutes}m` : `${hours}:${leftoverMinutes}`
}

export const normalizeText = (s:string) => s.toLowerCase().replace(/-/g, " ").trim()