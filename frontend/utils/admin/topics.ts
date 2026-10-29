import { toTitleCase } from "../renderFormattedText"

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

// Add time_estimate based on difficulty
export default function timeEstimate(difficulty:string)  {
    const difficutlyToTime: Record<string, number> = {
        easy: 30,
        medium: 60,
        hard: 90
    }
    return difficutlyToTime[difficulty] ?? 0
}

export const sectionToTopic: Record<string, string[]> = {
    reading: readingTopics, 
    math: mathTopics
}


export const topicToSubtopics: Record<string, string[]> = {
    "information & ideas":[ "main idea", "details", "function","claims", "data", "inferences"], 
    "craft & structure":[ "words in context", "main purpose", "structure", "cross-text connections"], 
    "expression of ideas":["rhetorical synthesis", "transition words"], 
    "standard english conventions":["sentence structure", "commas", "punctuation marks", "punctuation marks & sentence structure", "verbs", "pronouns", "misplaced modifiers", "parallel structure"], 
    
    "algebra":["algebra skills", "linear functions", "linear function interpretations", "system of linear equations", "functions", "systems of equations", "slope-intercept form", "slope", ""], 
    "advanced math":["exponents", "roots", "exponential growth & decay", "quadratic equations"], 
    "problem solving & data analysis":["statistical analysis", "mean, median, mode, & range", "ratios & proportions", "unit conversions"], 
    "geometry & trigonometry":["angles", "shapes", "similar triangles", "trigonometry", "circle equation"]

}