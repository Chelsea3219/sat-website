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

// Format of student answer for each quiz question
export type AnswerSheet = {
    clerk_id: string
    session_id: string 
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

// Format of student answer for each quiz question
export type PracticeAnswerSheet = {
    clerk_id: string
    session_id: string
    question_id: string
    question_type: string 
    section: string
    topic: string
    subtopic: string[]
    difficulty: string
    answer_attempts: string[]
    is_correct: boolean
    time_elapsed: number
    num_hints: number
    completed_at: string
}

export type QuestionAttempts = {
    id: string
    session_id: string
    clerk_id: string
    question_id: string
    type: string
    difficulty: string 
    is_correct: boolean
    time_elapsed: number
    completed_at: string
}


export type QuizQuestionTabProps = {
    currentQuestion: Question
    answer: string
    answerChangeAction: (value: string) => void
    checkAnswerAction: () => void
    timeElapsed: number
    error?: string
}


export type PracticeQuestionTabProps = QuizQuestionTabProps & {
    numAttempts: number
    checkHintAction: () => void 
    nextQuestion: () => void 
    isCorrect: boolean | null 

}