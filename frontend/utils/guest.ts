

// Subtopics the shared guest account is allowed to practice
export const GUEST_ALLOWED_SUBTOPICS = ["transition-words", "linear-functions"]

// Where to send guest who opens a locked subtopic
export const GUEST_DEFAULT_PRACTICE_PATH = "/dashboard/practice/reading/expression-of-ideas/transition-words"

export function isGuestAllowedSubtopic(subtopic: string | null  | undefined): boolean {
    if (!subtopic) return false
    return GUEST_ALLOWED_SUBTOPICS.includes(subtopic.toLowerCase())
}