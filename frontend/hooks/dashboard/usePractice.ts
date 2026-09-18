import { useEffect, useState, useRef} from "react"
import {Question, PracticeAnswerSheet} from "@/types/questions"
import { fetchPracticeQuestions } from "@/services/api.questions"
import {checkIfCorrect} from "@/utils/CheckIfCorrect"

type PracticeQuestionTabProps = {
    clerkId?: string | null | undefined
    sessionId?: string | null
    subtopic: string 
}

const BATCH_SIZE = 10

export default function usePractice({clerkId, sessionId, subtopic}: PracticeQuestionTabProps) {

    // Initializes the parameters -----------------------------------------------------------------------------
    const [prevSubtopic, setPrevSubtopic] = useState(subtopic)
    const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState<number>(0)

    const [answer, setAnswer] = useState<string>("")
    const [answerAttempts, setAnswerAttempts] = useState<string[]>([])
    const [answerSheet, setAnswerSheet] = useState<PracticeAnswerSheet[]>([]) // Stores the student's answers for each question

    const [message, setMessage] = useState("")

    // Tracks how many questions have been answered since the last fetch, to trigger refetch every BATCH_SIZE (refs dont trigger rerenders and persist across renders)
    const questionsAnsweredSinceLastFetch = useRef(0)

    // Reset session state synchronously during render when the subtopic changes
    if (prevSubtopic !== subtopic) {
        setPrevSubtopic(subtopic)
        setAnswerSheet([])
        setCurrentIndex(0)
    }

    // Reset the ref-based counter in an effect (refs must not be touched during render)
    useEffect(() => {
        questionsAnsweredSinceLastFetch.current = 0
    }, [subtopic])

    //const [quizResults, setQuizResults] = useState<IncomingGradedAnswerSheet | null>(null)

    // Declare the currentQuestion
    const currentQuestion = practiceQuestions[currentIndex]

    // Fetches a new batch of practice questions for the specific clerk_id and subtopic -----------------------------
    const loadQuestions = async( sheetSoFar: PracticeAnswerSheet[]) => {
        if (!clerkId || !subtopic) return
        const safeClerkId : string = clerkId
        try {
            const response = await fetchPracticeQuestions(safeClerkId, subtopic, sheetSoFar)
            //console.log("practice questions ==>> ", response)
            setPracticeQuestions(response)
            setCurrentIndex(0)
        } catch (error) {
            console.error("Error fetching practice questions:", error)
        }
    }

    // Initial fetch on mount / when the subtopic changes ----------------------------------------------------------
    useEffect(() => {
        if (!clerkId || !subtopic) return

        let cancelled = false

        const fetchInitialBatch = async () => {
            const safeClerkId: string = clerkId
            try {
                const response = await fetchPracticeQuestions(safeClerkId, subtopic, [])
                if (!cancelled) {
                    setPracticeQuestions(response)
                    setCurrentIndex(0)
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching practice questions:", error)
                }
            }
        }

        fetchInitialBatch()

        return () => {
            cancelled = true
        }
    }, [clerkId, subtopic])
    

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
        // Guard 
        if (!currentQuestion) return 

        // Adds the selected answer to the answerAttempts
        const updatedAttempts = [...answerAttempts, answer]
        setAnswerAttempts(updatedAttempts)

        // Checks to see if the asnwer is correct
        const isCorrect = checkIfCorrect(answer, currentQuestion)
        console.log(`Answer for question ${practiceQuestions[currentIndex].question_id} is ${isCorrect ? "correct" : "incorrect"}`)

        // Formats and add the answer to the student's answer history
        const currentAnswer : PracticeAnswerSheet = {
            clerk_id: clerkId ?? "",
            session_id: sessionId ?? "",
            question_id: currentQuestion.question_id,
            subtopic: currentQuestion.subtopic,
            section: currentQuestion.section,
            topic: currentQuestion.topic,
            difficulty: currentQuestion.difficulty,
            answer_attempts: updatedAttempts, 
            is_correct: isCorrect,
            time_elapsed: timeElapsed,
            completed_at: new Date().toISOString().split('T')[0], // Sets the completed_at to the current date at midnight
            num_hints:3, //TODO GO BACK 
        }

        // If correct, save the answerData to the answerSheet OR answer again
        try {
            if (isCorrect) {
                const updatedSheet = [...answerSheet, currentAnswer]
                setAnswerSheet(updatedSheet)

                // Resets 
                setAnswer("")
                setAnswerAttempts([])
                setTimeElapsed(0)
                setMessage("")

                questionsAnsweredSinceLastFetch.current += 1

                const isLastBatch = currentIndex === practiceQuestions.length - 1
                const hitBatchThreshold = questionsAnsweredSinceLastFetch.current >= BATCH_SIZE
                
                if (isLastBatch || hitBatchThreshold) {
                    // Refetch a new batch, using the full session history
                    questionsAnsweredSinceLastFetch.current = 0 
                    await loadQuestions(updatedSheet)
                } else {
                    setCurrentIndex(prev => prev + 1)
                }
            } else {
                setMessage("Incorrect Answer. Try again.")
            }
        } catch (error) {
            console.error("Error sending the answerSheet to the backend", error)
        }

    }
    
    return {
        currentQuestion, currentIndex,
        answer, handleAnswerChange, answerSheet, checkAnswer, answerAttempts,
        timeElapsed, 
        message
    }
}