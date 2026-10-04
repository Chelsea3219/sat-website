"use client"

import {useUserInformationContext} from "@/contexts/StudentInformationContext"
import usePractice from "@/hooks/dashboard/usePractice"
import PracticeTabWindow from "../ui/tab-window/practice/PracticeTabWindow"
import { PracticeQuestionTabProps } from "@/types/questions"
import { SessionProgress } from "@/types/students"


type PageProps = {
    section:string
    topic: string
    subtopic: string
    activeTab: "Review" | "Questions" | "Answer"
}

export default function PracticeClient({section, topic, subtopic, activeTab}:PageProps) {

    // Fetch student's information from useStudentInformationContext hook 
    const {studentInfo, sessionId, subtopicMastery} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id

    // Fetches the parameters for PracticeTabWindow
    const {
        currentQuestion, inSessionScore, numCompleted, isLoading, 
        answer, handleAnswerChange, checkAnswer, answerAttempts, isCorrect, 
        timeElapsed, handleHint, nextQuestion, 
        sessionResults,
    } = usePractice({clerkId, sessionId, subtopic})

    
    // Delare the parameters
    const numAttempts = answerAttempts.length
    const questionTabProps : PracticeQuestionTabProps = {
        currentQuestion: currentQuestion,
        answer:answer,
        answerChangeAction: handleAnswerChange,
        checkAnswerAction:checkAnswer,
        timeElapsed: timeElapsed,
        numAttempts: numAttempts, 
        checkHintAction: handleHint,
        nextQuestion: nextQuestion,
        isCorrect: isCorrect
    }

    const progress: SessionProgress = {
        masteryScore: inSessionScore ?? 0,
        numCompleted: numCompleted, 
        numQuestions: 10,
        trend: "down"
    }
    const pastSubtopicMastery = subtopicMastery
    return (
        <>
            <div className="">
                <div className="w-full h-full">
                    <PracticeTabWindow
                        section = {section}
                        topic = {topic}
                        subtopic = {subtopic}
                        activeTab={activeTab}
                        questionTabProps={questionTabProps}
                        progress={progress}
                        isLoading={isLoading}
                        practiceResults={sessionResults}
                        pastSubtopicMastery={pastSubtopicMastery}
                    />
                </div>
            </div>
        </>
    )
}