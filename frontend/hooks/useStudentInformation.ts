"use client"

import {useCallback, useEffect, useState } from "react"
import {IncomingStudentInformation} from "@/types/students"
import { fetchStudentInformation } from "@/services/api.student-info"


export default function useStudentInformation (isLoaded:boolean, isSignedIn:boolean|undefined) {

    // Initializes the paramaters 
    const [studentInformation, setStudentInformation] = useState<IncomingStudentInformation | null>(null)
    const [isFetched, setIsFetched] = useState(false)

    // Initial fetch once Clerk has loaded and the user is signed in
    useEffect(() => {
        if (!isLoaded || !isSignedIn) return
        let cancelled = false

        fetchStudentInformation()
            .then((response) => { if (!cancelled) setStudentInformation(response) })
            .catch((error) => console.error("Failed to fetch student's information: ", error))
            .finally(() => { if (!cancelled) setIsFetched(true) })

        return () => { cancelled = true }   // ignore results if the user signs out mid-request
    }, [isLoaded, isSignedIn])

    // Manual re-fetch, e.g. after registration (called from an event handler, not an effect)
    const refresh = useCallback(async () => {
        try {
            setStudentInformation(await fetchStudentInformation())
        } catch (error) {
            console.error("Failed to refresh student's information: ", error)
        } finally {
            setIsFetched(true)
        }
    }, [])

    // Creates new parameters based on response 
    const studentInfo = studentInformation?.student_info
    const testScores = studentInformation?.test_scores
    const questionStats = studentInformation?.question_stats
    const quizAnalytics = studentInformation?.quiz_analytics
    const subtopicMastery = studentInformation?.subtopic_mastery
    const isProfileIncomplete = !!studentInfo && !studentInfo.learning_targets

    // TODO Redirect to pricing page if user's access has expired, redirected them to the pricing page or another page where they can extend their subscription


    return {studentInfo, questionStats, quizAnalytics, testScores, subtopicMastery, isProfileIncomplete, isFetched, refresh}
}