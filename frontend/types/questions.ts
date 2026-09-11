// Questions from database table
export type Question = {
    question_id: string
    section: string
    topic: string
    subtopic: string[]

    difficulty: string
    time_estimate: number

    question_type: string

    text:string
    equation: string
    diagram: string

    multiple_choices: Record<string, string> | null
    answer_key: string | string[]
}

// Format of student answer for each question
export type AnswerSheet = {
    clerk_id: string
    question_id: string
    section: string
    topic: string
    subtopic: string[]
    difficulty: string
    answer: string
    is_correct: boolean
    time_elapsed: number
    completed_at: string
}


export type QuestionTabProps = {
    currentQuestion: Question
    numAttempts?: number
    answer: string
    answerChangeAction: (value: string) => void
    checkAnswerAction: () => void
    timeElapsed: number
    error?: string 
}