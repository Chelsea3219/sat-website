"use client"

import {useEffect, useState } from "react"
import {IncomingStudentInformation} from "@/types/students"
import { fetchStudentInformation } from "@/services/api.student-info"


export default function useStudentInformation (clerkId: string | null | undefined) {

    // Initializes the paramaters 
    const [studentInformation, setStudentInformation] = useState<IncomingStudentInformation | null>(null)

    // Fetches the student's information, test scores, and latest analytics
    useEffect(() => {
        if (!clerkId) return 

        const load = async() => {
            try {
                const response = await fetchStudentInformation(clerkId)
                console.log("clerkId in useStudentInformation:", clerkId)
                console.log("student's information => ", response)
                setStudentInformation(response)
            } catch (error) {
                console.error("Failed to fetch student's information: ", error)
            }
        }
        load()
    }, [clerkId])


    // Creates new parameters based on response 
    const studentInfo = studentInformation?.student_info
    const testScores = studentInformation?.test_scores
    const questionStats = studentInformation?.question_stats
    const pastAnalytics = studentInformation?.past_analytics
    const studentAnalytics = studentInformation?.student_analytics
    const subtopicMastery = studentInformation?.subtopic_mastery


    return {studentInfo, questionStats, pastAnalytics, studentAnalytics, testScores, subtopicMastery}
}