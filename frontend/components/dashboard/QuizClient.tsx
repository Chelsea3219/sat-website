"use client"

import { QuestionTabProps } from "@/types/questions"
import QuizTabWindow from "../ui/tab-window/QuizTabWindow"
import useQuizQuestionTab from "@/hooks/useQuizQuestionTab"
import {useUserInformationContext} from "@/contexts/StudentInformationContext"

type TabWindowProps = {
    clerkId: string
    section: string
    activeTab: "Reading" | "Math"
}


export default function QuizClient({section, activeTab}: TabWindowProps) {
    
    // Fetch student's information from useStudentInformationContext hook 
    const {studentInfo, studentAnalytics, testScores} = useUserInformationContext()
    const clerkId = studentInfo?.clerk_id
    
    // Fetch questions from useQuizQuestionTab hook
    const { quizQuestions, currentIndex, timeElapsed, currentQuestion, answer, checkAnswer, handleAnswerChange} = useQuizQuestionTab({clerkId, section})

    // Sample Question
    const questionTabProps : QuestionTabProps = {
        currentQuestion: currentQuestion,
        answer: answer, 
        checkAnswerAction: checkAnswer,
        answerChangeAction: handleAnswerChange,
        timeElapsed: timeElapsed,
    }

    // Guard
    if (!studentInfo || !studentAnalytics || !testScores) return <p>Loading student information...</p>

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
                    />
            </div>
        </>
    )
}