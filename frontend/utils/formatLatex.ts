

export const formatLatex = (input: string) => {
    if (!input) return ""
    const trimmed = input.trim()

    // If already wrapped, keep it
    if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
        return trimmed
    }

    // Detect likely LaTeX/math
    const hasMath = /\\|_|\^|\{|\}|=|\+|\-|\frac|\sqrt/.test(trimmed)

    return hasMath ? `$${trimmed}$` : trimmed
}