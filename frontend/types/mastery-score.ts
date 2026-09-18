import {MasteryScore} from "@/types/students"

type QuestionsAnswered = {
    num_incorrect: number 
    num_questions: number 
}
type SubtopicMastery2 = {
    subtopic: string
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
    topics_mastery: Record<string, MasteryScore>
    subtopics_mastery: SubtopicMastery2[]
    gold_analytics: GoldAnalytics
}