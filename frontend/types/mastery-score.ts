import {MasteryScore} from "@/types/students"

type QuestionsAnswered = {
    num_incorrect: number 
    num_questions: number 
}
type SubtopicMastery2 = {
    subtopic: string
    section: string 
    mastery_score: MasteryScore
    questions_answered: QuestionsAnswered
    avg_time_elapsed: number
    status: string
}

type GoldAnalytics = {
    reading_mastery: MasteryScore
    math_mastery: MasteryScore
    reading_topics_mastery: Record<string, MasteryScore>
    math_topics_mastery: Record<string, MasteryScore>

}
export type IncomingGradedAnswerSheet = {
    section_mastery: MasteryScore
    topic_mastery: Record<string, MasteryScore>
    subtopic_mastery: SubtopicMastery2[]
    updated_quiz_analytics: GoldAnalytics
}


type SessionSubtopicMastery = {
    current_subtopic_mastery: SubtopicMastery2
    updated_subtopic_mastery: SubtopicMastery2
}

export type PracticeGradedResponse = {
    subtopics: Record<string, SessionSubtopicMastery>
}