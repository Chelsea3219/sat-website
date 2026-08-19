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
export type StudentAnswer = {
    id: string
    question_id: string
    section: string
    topic: string 
    subtopic: string[]
    difficulty: string
    answer: string
}


export type QuestionTabProps = {
    question: Question
    answer: string
    fieldChangeAction: (field: keyof StudentAnswer, value: string) => void // Adds the questions to the answerForm to later analyze
    timeElasped: number
    checkAnswerAction: () => void
    numAttempts?: number
    error: string
}

