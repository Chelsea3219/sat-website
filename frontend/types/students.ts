// User Registration Information
export type UserRegistration = {
    clerk_id: string
    first_name: string
    last_name: string
    email: string

    school: string
    state: string
    grade_level: string
    original_score: {
        original_score: number
        reading_score: number
        math_score: number
    }
    dream_score: number
    test_date: string

    subscription: "free" | "starter" | "advanced"
    referral: string
    learning_targets: {
        daily_goal: number
        weekly_goal: number
    }
}

export type StudentInfo = {
    clerk_id: string
    first_name: string
    last_name: string
    email: string

    school: string
    state: string
    grade_level: string
    original_score: OriginalScore
    dream_score: number
    test_date: string

    subscription: "free" | "starter" | "advanced"
    referral: string
    learning_targets: {
        daily_goal: number
        weekly_goal: number
    }
    updated_at: string 
}

export type OriginalScore = {
    original_score: number
    reading_score: number
    math_score: number
}

export type TestScores = {
    id: string 
    clerk_id: string 
    current_score: OriginalScore
    dream_score: number
    type: string
    test_date: string
    created_at: string 
}

export type MasteryScore = {
    max_score: number
    raw_score: number
    mastery_score: number
}

export type ReadingTopicsMastery = {
    "craft & structure": MasteryScore
    "expression of ideas": MasteryScore
    "information & ideas": MasteryScore
    "standard english conventions": MasteryScore
}

export type MathTopicsMastery = {
    "algebra": MasteryScore
    "advanced math": MasteryScore
    "geometry & trigonometry": MasteryScore
    "problem solving & data analysis": MasteryScore
}

export type QuizAnalytics = {
    session_id: string
    clerk_id: string
    type: string
    topic: string 
    reading_mastery: MasteryScore
    reading_topics_mastery: ReadingTopicsMastery
    math_mastery: MasteryScore
    math_topics_mastery: MathTopicsMastery
    weak_subtopics: {
        math: Record<string, unknown>
        reading: Record<string, unknown>
    }
    completed_at: string
}

export type SilverQuizAnalytics = {
    session_id: string 
    clerk_id: string 
    section: string 
    section_mastery: MasteryScore
    topics_mastery: Record<string, MasteryScore>
    completed_at: string 
}

export type SubtopicMastery = {
    id: string
    clerk_id: string 
    section: string
    topic: string
    subtopic: string
    mastery_score: MasteryScore
    questions_answered: {
        num_incorrect: number
        num_questions: number 
    }
    avg_time_elapsed: number
    status: string
    last_wrong_at: string 
    
}

export type IncomingStudentInformation = {
    student_info: StudentInfo
    question_stats: {
        num_questions: number 
        num_correct: number
        time_spent: number
    }
    test_scores: TestScores
    quiz_analytics: QuizAnalytics[]
    subtopic_mastery: SubtopicMastery[]
}


export type PastQuizAnalytics = {
    past_quizzes: SilverQuizAnalytics[]
    num_quizzes: number 
}


export type SessionProgress = {
    masteryScore: number | null 
    numCompleted: number 
    numQuestions?: number 
    trend: "up" | "down" | "flat"
}