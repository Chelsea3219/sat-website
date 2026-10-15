import katex from 'katex'
import 'katex/dist/katex.min.css'

export const formatLatex = (input: string) => {
    if (!input) return ""
    return input.trim()
}

type Segment =
    | { type: "text"; content: string }
    | { type: "math"; content: string; display: boolean }

// Order matters: "$$" must be checked before "$"
const DELIMITERS = [
    { open: "$$",  close: "$$",  display: true  },
    { open: "\\[", close: "\\]", display: true  },
    { open: "\\(", close: "\\)", display: false },
    { open: "$",   close: "$",   display: false },
]

// Find the closing delimiter, skipping escaped pairs like "\\" (row break) or "\$"
function findClose(s: string, from: number, close: string) {
    let i = from
    while (i < s.length) {
        if (s.startsWith(close, i)) return i
        i += s[i] === "\\" ? 2 : 1
    }
    return -1
}

export function splitLatex(input: string): Segment[] {
    const segments: Segment[] = []
    let text = ""
    let i = 0

    const flushText = () => {
        if (text) segments.push({ type: "text", content: text })
        text = ""
    }

    while (i < input.length) {
        // Escaped dollar sign or a literal "\\" in plain text
        if (input.startsWith("\\$", i)) { text += "$"; i += 2; continue }
        if (input.startsWith("\\\\", i)) { text += "\\\\"; i += 2; continue }

        const delim = DELIMITERS.find(d => input.startsWith(d.open, i))
        if (delim) {
            const start = i + delim.open.length
            const end = findClose(input, start, delim.close)
            if (end !== -1) {
                flushText()
                segments.push({
                    type: "math",
                    content: input.slice(start, end),
                    display: delim.display,
                })
                i = end + delim.close.length
                continue
            }
        }

        text += input[i]
        i++
    }

    flushText()
    return segments
}

const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

const renderMath = (tex: string, displayMode: boolean) =>
    katex.renderToString(tex, {
        throwOnError: false, // half-typed LaTeX shows in red instead of throwing
        displayMode,
    })

export function renderLatex(text: string) {
    if (!text) return ""

    const formatted = formatLatex(text)
    const segments = splitLatex(formatted)
    const hasDelimitedMath = segments.some(s => s.type === "math")

    // Fallback: no delimiters, but it looks like raw LaTeX (e.g. "x^2"), so render it all as math
    if (!hasDelimitedMath) {
        const looksLikeLatex = /\\[a-zA-Z]+|[_^{}]/.test(formatted)
        return looksLikeLatex ? renderMath(formatted, false) : escapeHtml(formatted)
    }

    return segments
        .map(s => s.type === "math" ? renderMath(s.content, s.display) : escapeHtml(s.content))
        .join("")
}

export const wrapSigma = (s: string) => `\\(${s}\\)`
export const wrapBraces = (s: string) => `{${s}}`