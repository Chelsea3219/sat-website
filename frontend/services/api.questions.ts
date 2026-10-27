import { AnswerSheet, PracticeAnswerSheet} from "@/types/questions"

// Fetch quiz questions for a specific section
export async function fetchQuizQuestions( section: string) {
    const res = await fetch(`/api/questions/quiz/fetch-questions/${section}`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch quiz questions")
    }
    const data = await res.json()

    return data 
}


// Fetch quiz questions for a specific section
export async function fetchPracticeQuestions(subtopic: string, sessionAnswers: PracticeAnswerSheet[]) {
    const res = await fetch(`/api/questions/practice/fetch-questions/${subtopic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionAnswers)
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch practice questions")
    }
    const data = await res.json()

    return data 
}


// Grade answersheet
export async function gradeQuizQuestions(
    answerSheet:AnswerSheet[], 
    section: string, sessionId:string
) {

    const response = await fetch(`/api/questions/quiz/grade-questions`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({answerSheet, section, sessionId})
    })

    if (!response.ok) {
        const text = await response.text()
        console.error("API error:", response.status, text)
        throw new Error("Failed to grade answerSheet")
    }
    
    const data = await response.json()

    return data 
}

// Grade answersheet
export async function gradePracticeQuestions(
    answerSheet:PracticeAnswerSheet[], 
    subtopic: string, sessionId:string
) {
    if (!subtopic || !sessionId) return 

    const response = await fetch(`/api/questions/practice/grade-questions`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({answerSheet, subtopic, sessionId})
    })

    if (!response.ok) {
        const text = await response.text()
        console.error("API error:", response.status, text)
        throw new Error("Failed to grade practice answerSheet")
    }
    
    const data = await response.json()
    return data 
}