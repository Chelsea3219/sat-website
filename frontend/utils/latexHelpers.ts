import katex from 'katex'; 
import 'katex/dist/katex.min.css'

export const formatLatex = (input: string) => {
    if (!input) return ""

    return input.trim()
}

export function renderLatex(text: string) {
    if (!text) return ""

    const formatted = formatLatex(text)

    // Only render with KaTeX if the text contains likely LaTeX
    const hasLatex =
        /\\[a-zA-Z]+|[_^{}]|\\frac|\\sqrt/.test(formatted)

    if (!hasLatex) {
        return formatted
    }

    return katex.renderToString(formatted, {
        throwOnError: false,
        displayMode: false,
    })
}