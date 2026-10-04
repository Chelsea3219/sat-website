import { useEffect, useState } from "react"
import {Question, AnswerSheet} from "@/types/questions"
import { IncomingGradedAnswerSheet } from "@/types/mastery-score"
import { fetchQuizQuestions, gradeQuizQuestions } from "@/services/api.questions"
import {checkIfCorrect} from "@/utils/CheckIfCorrect"

type QuizQuestionTabProps = {
    clerkId?: string 
    sessionId?: string | null
    section: string 
}


export default function useQuizQuestionTab({clerkId, sessionId, section}:QuizQuestionTabProps){

    // Initializes the parameters -----------------------------------------------------------------------------
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState<number>(0)
    const [answer, setAnswer] = useState<string>("")
    const [answerSheet, setAnswerSheet] = useState<AnswerSheet[]>([]) // Stores the student's answers for each question
    const [quizResults, setQuizResults] = useState<IncomingGradedAnswerSheet | null>(null)
    const [quizCompleted, setQuizCompleted] = useState(false)


    // Fetches the quiz questions for the specific clerk_id and section ---------------------------------------
    useEffect(() => {
        if (!clerkId || !section) return

        const load = async() => {
            try {
                const response = await fetchQuizQuestions(clerkId, section)
                console.log("quiz questions => ", response)
                setQuizQuestions(response)
            } catch (error) {
                console.error("Error fetching quiz questions:", error)
            }
        }

        load()
    }, [clerkId, section])
    

    // Starts the stopwatch timer when the current question changes -----------------------------------------------
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [currentIndex])


    // Handle the answer field change -----------------------------------------------------------------------------
    const handleAnswerChange = (value:string) => setAnswer(value)


    // Checks the answer, updates the current question index, and resets the timer ---------------------------------
    const checkAnswer = async () => {
        if (!clerkId || !sessionId) return 

        // Checks to see if the asnwer is correct
        const isCorrect = checkIfCorrect(answer, quizQuestions[currentIndex])
        //console.log(`Answer for question ${quizQuestions[currentIndex].question_id} is ${isCorrect ? "correct" : "incorrect"}`)

        // Adds the answer to the student's answer history
        const currentAnswer : AnswerSheet = {
            clerk_id: clerkId ?? "",
            session_id: sessionId ?? "",
            question_id: quizQuestions[currentIndex].question_id,
            subtopic: quizQuestions[currentIndex].subtopic,
            section: quizQuestions[currentIndex].section,
            topic: quizQuestions[currentIndex].topic,
            difficulty: quizQuestions[currentIndex].difficulty,
            answer: answer,
            is_correct: isCorrect,
            time_elapsed: timeElapsed,
            completed_at: new Date().toISOString().split('T')[0] // Sets the completed_at to the current date at midnight
        }
        //console.log("Current Answer => ", currentAnswer)
        const updatedAnswerSheet = [...answerSheet, currentAnswer]
        setAnswerSheet(updatedAnswerSheet)
        //console.log("Answer Sheet => ", answerSheet)

        // Resets 
        setAnswer("")
        setTimeElapsed(0)

        // Score the answerSheet and send it to the backend if it's the last question
        const isLastQuestion = currentIndex == quizQuestions.length - 1
        if (isLastQuestion) {
            try{
                const response = await gradeQuizQuestions(answerSheet, section, clerkId, sessionId)
                setQuizResults(response)
                console.log("results after grading => ", response)
                
                setQuizCompleted(true)
            } catch (error) {
                console.error("Failed to grade quiz: ", error)
            }
            return
        } else {
            setCurrentIndex(prevIndex => prevIndex + 1)
        }
    }


    // Declare the current question based on the current index 
    const currentQuestion = quizQuestions[currentIndex] ?? null 

    return { quizQuestions, currentIndex, timeElapsed, currentQuestion, answer, answerSheet, checkAnswer, handleAnswerChange, quizCompleted, quizResults}
}