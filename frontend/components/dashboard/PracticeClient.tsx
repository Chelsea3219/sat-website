"use client"

import {useUserInformationContext} from "@/contexts/StudentInformationContext"
import usePractice from "@/hooks/dashboard/usePractice"
import PracticeTabWindow from "../ui/tab-window/practice/PracticeTabWindow"
import { QuestionTabProps } from "@/types/questions"


type PageProps = {
    section:string
    topic: string
    subtopic: string
    activeTab: "Review" | "Questions" | "Answer"
}

export default function PracticeClient({section, topic, subtopic, activeTab}:PageProps) {

    // Fetch student's information from useStudentInformationContext hook 
    const {studentInfo, studentAnalytics, testScores, sessionId} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id

    // Fetches the parameters for PracticeTabWindow
    const {
        currentQuestion,
        answer, handleAnswerChange, checkAnswer, answerAttempts, 
        timeElapsed
    } = usePractice({clerkId, sessionId, subtopic})

    
    // Delare the parameters
    const numAttempts = answerAttempts.length
    const questionTabProps : QuestionTabProps = {
        currentQuestion: currentQuestion,
        answer:answer,
        answerChangeAction: handleAnswerChange,
        checkAnswerAction:checkAnswer,
        timeElapsed: timeElapsed,
        numAttempts: numAttempts
    }

    // Guard
    if (!studentInfo || !studentAnalytics || !testScores) return <p>Loading student information...</p>

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="w-full h-full">
                    <PracticeTabWindow
                        section = {section}
                        topic = {topic}
                        subtopic = {subtopic}
                        activeTab={activeTab}
                        questionTabProps={questionTabProps}
                        score={100}
                    />
                </div>
            </div>
        </>
    )
}