import { useEffect, useState } from "react"
import { PastQuizAnalytics } from "@/types/students"
import {useUserInformationContext} from "@/contexts/StudentInformationContext"
import {estimateSATSectionScore2} from "@/utils/scoreAlgorithms"
import { fetchDailyWeeklysStats, fetchPastQuizAnalytics} from "@/services/api.student-info"
import { formatMinutes} from "@/utils/renderFormattedText"
import { topicBreakdown } from "@/utils/analytics"
import { readingTopics, mathTopics } from "@/utils/topics"

type DailyWeeklyStats = {
    num_questions: number | string
    time_spent: number | string 
    weekly_num_questions: number | string 
    weekly_time_spent: number 
}

export default function useDashboard(){
    const {studentInfo, questionStats, quizAnalytics, subtopicMastery} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id

    // Retrieves the daily and weekly stats
    const [apiResponse, setAPIResponse] = useState<DailyWeeklyStats | undefined>()
    const [apiResponse2, setAPIResponse2] = useState<PastQuizAnalytics>()
    useEffect(() => {
        if (!clerkId) return 
        const load = async() => {
            try {
                const response1 = await fetchDailyWeeklysStats(clerkId)
                const response2 = await fetchPastQuizAnalytics(clerkId)
                setAPIResponse(response1)
                setAPIResponse2(response2)
            } catch (error) {
                console.error("Unable to fetch daily and weekly stats.", error)
                console.error("Unable to fetch past quiz analytics.", error)
            } 
        }
        load()
    }, [clerkId])
    
    // Guard
    if (!studentInfo || !questionStats || !quizAnalytics || !subtopicMastery || !apiResponse) {
        return {isLoading: true, dailyWeeklyStats: apiResponse}
    }

    // Formats the Daily and Weekly Stats
    const weeklyGoal = studentInfo.learning_targets.weekly_goal ?? 0
    const weeklyTimeSpent = apiResponse?.time_spent ?? 0 
    const dailyWeeklyStats = {
        num_questions: apiResponse?.num_questions ?? 0, 
        time_spent: `${formatMinutes(Number(weeklyTimeSpent ?? 0), false)} / ${studentInfo.learning_targets.daily_goal ?? 0} m`, 
        weekly_num_questions: apiResponse?.weekly_num_questions ?? 0,
        weekly_time_spent: `${formatMinutes(Number(apiResponse?.weekly_time_spent ?? 0), true)} / ${studentInfo.learning_targets.weekly_goal} h`, 
        weeklyGoal : studentInfo.learning_targets.weekly_goal
    }

    // Declares the parameters
    const sortedQuizAnalytics = [...quizAnalytics].sort((a,b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()) 
    const currentQuizAnalytics = sortedQuizAnalytics[0]
    const [readingScore, mathScore] = [currentQuizAnalytics.reading_mastery.mastery_score, currentQuizAnalytics.math_mastery.mastery_score]
    const [readingSATScore, mathSATScore] = [readingScore, mathScore].map(estimateSATSectionScore2)
    const currentScore = readingSATScore + mathSATScore

    let scoreChange: number | null = 0
    const prevQuizAnalytics = sortedQuizAnalytics[1]
    if (prevQuizAnalytics) {
        const [prevReadingSAT, prevMathSAT] = [
            prevQuizAnalytics.reading_mastery.mastery_score,
            prevQuizAnalytics.math_mastery.mastery_score,
        ].map(estimateSATSectionScore2)
        const prevScore = prevReadingSAT + prevMathSAT
        scoreChange = currentScore - prevScore
    }

    const fullName = studentInfo?.first_name + " " + studentInfo?.last_name
    const targetScore = studentInfo.dream_score
    console.log(currentScore)

    const readingTopicBreakdown = topicBreakdown(currentQuizAnalytics?.reading_topics_mastery, readingTopics)
    const mathTopicBreakdown = topicBreakdown(currentQuizAnalytics?.math_topics_mastery, mathTopics)

    const weakSubtopicBreakdown = [...subtopicMastery].sort((a,b) => a.mastery_score.mastery_score - b.mastery_score.mastery_score).slice(0,8) // TODO choose between dashboard or progress
    const currentSubtopicAnalytics = [...subtopicMastery].sort((a,b) => new Date(b.last_wrong_at).getTime() - new Date(a.last_wrong_at).getTime())[0]

    const pastQuizzes = apiResponse2?.past_quizzes

    if (!apiResponse) return 
    
    return {
        fullName, currentScore, targetScore, isLoading:false,
        subtopicMastery, weakSubtopicBreakdown, currentSubtopicAnalytics, dailyWeeklyStats, weeklyGoal, weeklyTimeSpent,
        readingScore, mathScore, readingSATScore, mathSATScore, readingTopicBreakdown, mathTopicBreakdown, scoreChange, 
        sortedQuizAnalytics, pastQuizAnalytics: pastQuizzes
    }
}