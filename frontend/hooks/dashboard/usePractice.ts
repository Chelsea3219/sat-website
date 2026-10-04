import { useEffect, useState, useRef} from "react"
import {Question, PracticeAnswerSheet} from "@/types/questions"
import {PracticeGradedResponse} from "@/types/mastery-score"
import { fetchPracticeQuestions, gradePracticeQuestions } from "@/services/api.questions"
import {checkIfCorrect} from "@/utils/CheckIfCorrect"



type PracticeQuestionTabProps = {
    clerkId?: string | null | undefined
    sessionId?: string | null
    subtopic: string 
}


export default function usePractice({clerkId, sessionId, subtopic}: PracticeQuestionTabProps) {

    // Initializes the parameters -----------------------------------------------------------------------------
    const [prevSubtopic, setPrevSubtopic] = useState(subtopic)
    const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentQuestion = practiceQuestions[currentIndex]
    const [timeElapsed, setTimeElapsed] = useState<number>(0)

    const [answer, setAnswer] = useState<string>("")
    const [answerAttempts, setAnswerAttempts] = useState<string[]>([])
    const [answerSheet, setAnswerSheet] = useState<PracticeAnswerSheet[]>([]) // Stores the student's answers for each question
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    const numCompleted = answerSheet.length ?? 0
    const [inSessionScore, setInSessionScore] = useState(0)
    const [sessionResults, setSessionResults] = useState<PracticeGradedResponse| null>(null)
    const sessionCompleted = sessionResults !== null 
    const [isLoading, setIsLoading] = useState(true)


    // Reset session state synchronously during render when the subtopic changes -------------------------------------
    if (prevSubtopic !== subtopic) {
        setPrevSubtopic(subtopic)
        setAnswerSheet([])
        setCurrentIndex(0)
        setAnswer("")
        setAnswerAttempts([])
        setTimeElapsed(0)
        setIsCorrect(null)
    }

    // Reset the ref-based counter in an effect (refs must not be touched during render)
    const unsentAnswers = useRef<PracticeAnswerSheet[]>([])
    useEffect(() => {
        if (!clerkId || !sessionId || !subtopic) return

        return () => {
            const toGrade = unsentAnswers.current
            unsentAnswers.current = []
            if (toGrade.length > 0) {
                gradePracticeQuestions(toGrade, subtopic, clerkId, sessionId)
                    .catch(err => console.error("Error flushing practice answers:", err))
            }
        }
    }, [clerkId, subtopic, sessionId])


    // Fetches a new batch of practice questions for the specific clerk_id and subtopic -----------------------------
    const loadQuestions = async( sheetSoFar: PracticeAnswerSheet[]) => {
        setIsLoading(true)
        if (!clerkId || !subtopic) return
        const safeClerkId : string = clerkId
        try {
            const response = await fetchPracticeQuestions(safeClerkId, subtopic, sheetSoFar)
            //console.log("practice questions ==>> ", response)
            setPracticeQuestions(response.selected_questions)
            setInSessionScore(response.in_session_score)
            setCurrentIndex(0)
        } catch (error) {
            console.error("Error fetching practice questions:", error)
        } finally {
            setIsLoading(false)
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
                    setPracticeQuestions(response.selected_questions)
                    setInSessionScore(response.in_session_score)
                    setCurrentIndex(0)
                    }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching practice questions:", error)
                }
            } finally{
                setIsLoading(false)
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
    const handleAnswerChange = (value:string) => {
        setAnswer(value)
        setIsCorrect(null)}

    // TODO -------------------------------------------------------------------------------------------------------
    // Create a function for when Hint 1 and 2 are pressed 
    const numHints = useRef(0)
    const handleHint = () => {numHints.current += 1}


    // Move onto the next question --------------------------------------------------------------------------------
    const GRADE_EVERY = 30
    const nextQuestion = async () => {
        console.log("numCompleted", numCompleted)

        // Guard against an empty answer 
        if (!clerkId || !sessionId || isCorrect !== true) return 

        const isLastInBatch = currentIndex === practiceQuestions.length - 1

        setAnswer("")
        setAnswerAttempts([])
        setTimeElapsed(0)
        setIsCorrect(null)
        numHints.current = 0

        // Save to the db every 30 correct answers 
        if (answerSheet.length >= GRADE_EVERY){
            const toGrade = unsentAnswers.current
            unsentAnswers.current = []
            try {
                console.log("answerSheet just sent to the backend: ", answerSheet)
                const response = await gradePracticeQuestions(toGrade, subtopic, clerkId!, sessionId!)
                setSessionResults(response)
                console.log(" current mastery score ", response.in_session_score)

            } catch (error) {
                unsentAnswers.current = [...toGrade, ...unsentAnswers.current]
                console.error("Error grading practice answers:", error)
            }
            return
        }

        // Fetch a new batch at the end of every batch of 10
        if (isLastInBatch) {
            await loadQuestions(answerSheet)
        } else {
           setCurrentIndex(prev => prev + 1)
        }
   }

    // Checks the answer, updates the current question index, and resets the timer ---------------------------------
    const checkAnswer = async () => {
        // Guard 
        if (!currentQuestion || !clerkId || !sessionId || isCorrect !== null || answer.trim() === "") return

        // Adds the selected answer to the answerAttempts
        const updatedAttempts = [...answerAttempts, answer]
        setAnswerAttempts(updatedAttempts)

        // Checks to see if the asnwer is correct
        const correct = checkIfCorrect(answer, currentQuestion)
        setIsCorrect(correct)
        //console.log(`Answer for question ${practiceQuestions[currentIndex].question_id} is ${isCorrect ? "correct" : "incorrect"}`)

        // Formats and add the answer to the student's answer history
        const currentAnswer : PracticeAnswerSheet = {
            clerk_id: clerkId ?? "",
            session_id: sessionId ?? "",
            question_id: currentQuestion.question_id,
            question_type: currentQuestion.question_type, 
            subtopic: currentQuestion.subtopic,
            section: currentQuestion.section,
            topic: currentQuestion.topic,
            difficulty: currentQuestion.difficulty,
            answer_attempts: updatedAttempts, 
            is_correct: correct,
            time_elapsed: timeElapsed,
            completed_at: new Date().toISOString().split('T')[0], // Sets the completed_at to the current date at midnight
            num_hints:numHints.current, //TODO GO BACK 
        }

        // If correct, adds to the answerSheet
        if (correct) {
            const updatedSheet = [...answerSheet, currentAnswer]
            setAnswerSheet(updatedSheet)
            unsentAnswers.current.push(currentAnswer)
        }
    }

    // Start a new set 
    const startNewSet = async () => {
        setSessionResults(null)
        setAnswerSheet([])
        unsentAnswers.current = []
        await loadQuestions([])
    }

    return {
        currentQuestion, currentIndex, inSessionScore, numCompleted, isLoading, 
        answer, handleAnswerChange, answerSheet, checkAnswer, answerAttempts, numAttempts: answerAttempts.length, isCorrect,
        timeElapsed, handleHint, nextQuestion, 
        startNewSet, sessionResults, sessionCompleted
    }
}