
import { PastQuizAnalytics } from "@/types/students"
import {useUserInformationContext} from "@/contexts/StudentInformationContext"
import { estimateSATSectionScore2, estimateSATScore} from "@/utils/scoreAlgorithms"
import { fetchPastQuizAnalytics} from "@/services/api.student-info"
import { toTitleCase } from "@/utils/renderFormattedText"
import { topicBreakdown } from "@/utils/analytics"
import { readingTopics, mathTopics } from "@/utils/topics"
import { useState, useEffect } from "react"
import { Achievement } from "@/components/progress/Acheivements"
import { fetchAchievements } from "@/services/api.student-info"


export default function useProgress() {

    // Fetches the student's information, test scores, and analytics
    const {studentInfo, questionStats, quizAnalytics, subtopicMastery} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id

    const [apiResponse, setAPIResponse] = useState<PastQuizAnalytics>()
    const [achievements, setAchievements] = useState<Achievement[]>([])

    useEffect(() => {
        if (!clerkId) return 
        const load = async() => {
            try {
                const response2 = await fetchPastQuizAnalytics(clerkId)
                const response3 = await fetchAchievements(clerkId)
                setAPIResponse(response2)
                setAchievements(response3)
            } catch (error) {
                console.error("Unable to fetch past quiz analytics.", error)
            } 
        }
        load()
    }, [clerkId])

    // Loading 
    const isLoading = !studentInfo || !questionStats || !apiResponse || !achievements
    if (isLoading) {
        return {isLoading: true as const}
    }

    // Guard against a new user
    const isNewUser = !quizAnalytics || !subtopicMastery
    if (isNewUser) {
        return {isNewUser: true as const}
    }


    // Declare the variables
    const sortedQuizAnalytics = [...quizAnalytics].sort((a,b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    const currentQuizAnalytics = sortedQuizAnalytics[0]

    const [readingScore, mathScore] = [currentQuizAnalytics.reading_mastery.mastery_score, currentQuizAnalytics.math_mastery.mastery_score]
    const masteryScore = (readingScore + mathScore) / 2

    const [readingSATScore, mathSATScore] = [readingScore, mathScore].map(estimateSATSectionScore2)
    const currentSATScore = readingSATScore + mathSATScore
    
    const readingTopicBreakdown = topicBreakdown(currentQuizAnalytics?.reading_topics_mastery, readingTopics)
    const mathTopicBreakdown = topicBreakdown(currentQuizAnalytics?.math_topics_mastery, mathTopics)

    const previousQuizAnalytics = sortedQuizAnalytics[1]
    let deltaScore = 0
    if (previousQuizAnalytics) {
        const [prevReadingScore, prevMathScore] = [previousQuizAnalytics.reading_mastery.mastery_score, previousQuizAnalytics.math_mastery.mastery_score]
        const prevSATScore = estimateSATScore(prevReadingScore, prevMathScore)
        deltaScore = currentSATScore - prevSATScore
    }

    const numCorrect = questionStats.num_correct ?? 0
    const numQuestions = questionStats.num_questions
    const timeSpent = questionStats.time_spent
    const numQuizzes = apiResponse?.num_quizzes
    const accuracyRate = numQuestions > 0
        ? Math.round((numCorrect / numQuestions) * 100)
        : 0;

    const loggedDatesOnly = quizAnalytics.map(pa => pa.completed_at.slice(0, 10))
    const trendData = Object.values(
        sortedQuizAnalytics.reduce((acc, past) => {
            const date = new Date(past.completed_at).toLocaleDateString()
            acc[date] = {
                date,
                readingScore: past.reading_mastery.mastery_score,
                mathScore: past.math_mastery.mastery_score
            }
            return acc
        }, {} as Record<string, { date: string; readingScore: number; mathScore: number }>)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    //console.log("trendData length", trendData.length)
    
    const weaknesses = subtopicMastery
        .filter(w => w.status === "needs_review" || w.status === "improving")
        .map(w => ({
        subtopic: toTitleCase( w.subtopic), 
        section: w.section,
        score: Math.round(w.mastery_score.mastery_score)
    })).sort((a,b) => a.score - b.score)

    const weakSubtopicBreakdown = [...subtopicMastery].sort((a,b) => a.mastery_score.mastery_score - b.mastery_score.mastery_score).slice(0,8) // TODO choose between dashboard or progress
        

    return{
        isLoading: false as const, 
        isNewUser: false as const,
        readingScore, mathScore, masteryScore, 
        readingSATScore, mathSATScore, currentSATScore,
        deltaScore,
        readingTopicBreakdown, mathTopicBreakdown, 
        numQuestions, numCorrect, numQuizzes, timeSpent, accuracyRate, 
        loggedDatesOnly, trendData,
        weaknesses, weakSubtopicBreakdown, 
        achievements
    }
}