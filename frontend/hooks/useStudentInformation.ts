"use client"

import {useEffect, useState } from "react"
import {IncomingStudentInformation} from "@/types/students"
import { fetchStudentInformation } from "@/services/api.student-info"


export default function useStudentInformation (clerk_id: string | null | undefined) {

    // Initializes the paramaters 
    const [studentInformation, setStudentInformation] = useState<IncomingStudentInformation | null>(null)

    // Fetches the student's information, test scores, and latest analytics
    useEffect(() => {
        if (!clerk_id) return 

        const load = async() => {
            try {
                const response = await fetchStudentInformation(clerk_id)
                console.log("student's information => ", response)
                setStudentInformation(response)
            } catch (error) {
                console.error("Failed to fetch student's information: ", error)
            }
        }
        load()
    }, [clerk_id])


    // Creates new parameters based on response 
    const studentInfo = studentInformation?.student_info
    const testScores = studentInformation?.test_scores
    const studentAnalytics = studentInformation?.student_analytics


    return {studentInfo, studentAnalytics, testScores}
}