import { toTitleCase } from "./renderFormattedText"

// List of topics per section 
export const readingTopics = ["information & ideas", "craft & structure", "expression of ideas", "standard english conventions"]
export const mathTopics = ["algebra", "advanced math", "problem solving & data analysis", "geometry & trigonometry"]


// Topic Breakdown if new user
export const readingTopicBreakdown: Record<string, number> = Object.fromEntries(
    readingTopics.map(topic => [
        toTitleCase(topic),
        0
    ])
)
export const mathTopicBreakdown: Record<string, number> = Object.fromEntries(
    readingTopics.map(topic => [
        toTitleCase(topic),
        0
    ])
)