

import {useUserInformationContext} from "@/contexts/StudentInformationContext"
import { estimateSATSectionScore2, estimateSATScore} from "@/utils/scoreAlgorithms"
import { toTitleCase } from "@/utils/renderFormattedText"


export default function useProgress() {

    // Fetches the student's information, test scores, and analytics
    const {studentInfo, questionStats, pastAnalytics, studentAnalytics, subtopicMastery} = useUserInformationContext()

    // Loading 
    const isLoading = !studentInfo || !questionStats
    if (isLoading) {
        return {isLoading: true as const}
    }

    // Guard against a new user
    const isNewUser = !pastAnalytics || !studentAnalytics || !subtopicMastery
    if (isNewUser) {
        return {isNewUser: true as const}
    }

    // Declare the variables
    const [readingScore, mathScore] = [studentAnalytics.reading_mastery.mastery_score, studentAnalytics.math_mastery.mastery_score]
    const readingTopicsScore = Object.fromEntries(
        Object.entries(studentAnalytics.reading_topics_mastery).map(([topic, score]) => [
            toTitleCase(topic),
            score.mastery_score
        ])
    )
    const mathTopicsScore = Object.fromEntries(
        Object.entries(studentAnalytics.math_topics_mastery).map(([topic, score]) => [
            toTitleCase(topic),
            score.mastery_score
        ])
    )

    const masteryScore = (readingScore + mathScore) / 2
    const [readingSATScore, mathSATScore] = [readingScore, mathScore].map(estimateSATSectionScore2)
    const currentSATScore = readingSATScore + mathSATScore
    const previousAnalytics = pastAnalytics[1]

    let deltaScore = 0
    if (previousAnalytics) {
        const [prevReadingScore, prevMathScore] = [previousAnalytics.reading_mastery.mastery_score, previousAnalytics.math_mastery.mastery_score]
        const prevSATScore = estimateSATScore(prevReadingScore, prevMathScore)
        deltaScore = currentSATScore - prevSATScore
    }

    const numCorrect = questionStats.num_correct
    const numQuestions = questionStats.num_questions
    const timeSpent = questionStats.time_spent
    const numQuizzes = pastAnalytics.filter(qa => qa.type === 'quiz').length

    const loggedDatesOnly = pastAnalytics.map(pa => pa.completed_at.slice(0, 10))

    const trendData = Object.values(
        pastAnalytics.reduce((acc, past) => {
            const date = new Date(past.completed_at).toLocaleDateString()
            acc[date] = {
                date,
                readingScore: past.reading_mastery.mastery_score,
                mathScore: past.math_mastery.mastery_score
            }
            return acc
        }, {} as Record<string, { date: string; readingScore: number; mathScore: number }>)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const weaknesses = subtopicMastery
        .filter(w => w.status === "needs_review" || w.status === "improving")
        .map(w => ({
        subtopic: toTitleCase( w.subtopic), 
        section: w.section,
        score: Math.round(w.mastery_score.mastery_score)
    })).sort((a,b) => a.score - b.score)
        

    return{
        isLoading: false as const, 
        isNewUser: false as const,
        readingScore, mathScore, masteryScore, 
        readingSATScore, mathSATScore, currentSATScore,
        deltaScore,
        readingTopicsScore, mathTopicsScore, 
        numQuestions, numCorrect, numQuizzes, timeSpent,
        loggedDatesOnly, trendData,
        weaknesses
    }
}