"use client"

import { QuizQuestionTabProps } from "@/types/questions"
import QuizTabWindow from "../ui/tab-window/quiz/QuizTabWindow"
import useQuizQuestionTab from "@/hooks/dashboard/useQuizQuestionTab"
import {useUserInformationContext} from "@/contexts/StudentInformationContext"


type TabWindowProps = {
    section: string
    activeTab: "Reading" | "Math"
}


export default function QuizClient({section, activeTab}: TabWindowProps) {
    
    // Fetch student's information from useStudentInformationContext hook 
    const {studentInfo, quizAnalytics, testScores, sessionId} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id
    
    // Fetch questions from useQuizQuestionTab hook
    const { 
        quizQuestions, currentIndex, timeElapsed, currentQuestion, 
        answer, checkAnswer, handleAnswerChange, 
        quizResults, quizCompleted
    } = useQuizQuestionTab({clerkId,sessionId, section})

    // Declare the variables
    const questionTabProps : QuizQuestionTabProps = {
        currentQuestion: currentQuestion,
        answer: answer, 
        checkAnswerAction: checkAnswer,
        answerChangeAction: handleAnswerChange,
        timeElapsed: timeElapsed,
        quizCompleted: quizCompleted
    }

    // Guard
    if (!studentInfo || !quizAnalytics || !testScores) return <p>Loading student information...</p>

    return (
        <>
            <div className="w-full h-full">
                <QuizTabWindow
                    section={section}
                    activeTab={activeTab}
                    progress={{
                        completedQuestions: currentIndex,
                        numQuestions: quizQuestions.length
                    }}
                    questionTabProps={questionTabProps}
                    quizResults={quizResults}
                    />
            </div>
        </>
    )
}