import { IncomingGradedAnswerSheet } from "@/types/mastery-score"
import { estimateSATSectionScore2 } from "@/utils/scoreAlgorithms"
import { SegmentedProgressBar } from "../../SegmentedProgressBar"
import { MoveRight} from "lucide-react"
import { colorChange } from "@/utils/renderColor"

type QuizResultsProp = {
    section: string
    quizResults: IncomingGradedAnswerSheet | null
}

export default function QuizResults({section, quizResults}: QuizResultsProp) {

    // Declare the variables
    const section_mastery = quizResults?.section_mastery
    const topics_mastery = quizResults?.topic_mastery
    const subtopics_mastery = quizResults?.subtopic_mastery
    const gold_analytics =  quizResults?.updated_quiz_analytics
    

    // Declare the font styles
    const headerStyle = "font-bold uppercase text-primary text-2xl"
    const subHeaderStyle = "font-semibold text-gray-500 text-lg"
    const scoreStyle = "text-5xl font-semibold"
    
    // Guard
    if (!section_mastery || !topics_mastery || !subtopics_mastery || !gold_analytics) return 

    // Build the summary data 
    const scoreSummary = [
        { label: "Mastery Score", value: section_mastery.mastery_score },
        { label: "SAT Score", value: estimateSATSectionScore2(section_mastery.mastery_score) }
    ]
    const numQuestions = subtopics_mastery.reduce((sum, sub) => sum + sub.questions_answered.num_questions, 0)
    const numIncorrect = subtopics_mastery.reduce((sum, sub) => sum + sub.questions_answered.num_incorrect, 0)
    const numCorrect = numQuestions - numIncorrect
    const weakSubtopics = subtopics_mastery
        .filter(sub => sub.mastery_score.mastery_score < 70)
        .sort((a,b) => a.mastery_score.mastery_score - b.mastery_score.mastery_score)
        .slice(0,8)
    const sectionMastery = section === "math" ? "math_mastery" : "reading_mastery"
    const deltaScore = [
        {label: "Mastery Score", newScore:gold_analytics[sectionMastery].mastery_score, oldScore:section_mastery.mastery_score}, 
        {label: "SAT Score", newScore: estimateSATSectionScore2(gold_analytics[sectionMastery].mastery_score), oldScore:estimateSATSectionScore2(section_mastery.mastery_score)}, 
    ]
    
    return (
        <>
            <div className="flex flex-col py-1 px-4 h-full space-y-8 items-stretch w-full ">

                <div className="flex flex-row gap-x-4">
                    <div className="flex flex-col flex-1 space-y-2 items-center">
                        <p className={headerStyle}>Total Score</p>
                        <div className="pl-4">
                            {scoreSummary.map(({label, value}) => (
                                <div key={label}>
                                    <p className={subHeaderStyle}>{label}</p>
                                    <p className={scoreStyle}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="border-r-4 border-secondary"></p>

                    <div className="flex flex-col flex-1 space-y-2">
                        <p className={headerStyle}>Question Breakdown</p>
                        <div className="flex flex-col pl-4 space-y-2 w-full">
                            {/* Number of Correct Answers  */}
                            <div className="flex flex-row items-center space-x-4">
                                <p className={scoreStyle}>{numCorrect}</p>
                                <p className={subHeaderStyle} style={{ lineHeight: "1.0" }}>Correct <br/> Answers</p>
                            </div>
                            {/* Number of Incorrect Answers and Questions */}
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 items-center">
                                    <p className={subHeaderStyle}>Total Questions:</p>
                                    <p className="text-lg font-semibold">{numQuestions}</p>
                                </div>
                                <div className="flex flex-row space-x-1 items-center">
                                    <p className={subHeaderStyle}>Total Incorrect:</p>
                                    <p className="text-lg font-semibold">{numIncorrect}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p className="border-r-4 border-secondary"></p>

                    <div className="flex flex-col flex-1 space-y-2">
                        <p className={headerStyle}>Improvement</p>
                        <div className="pl-4">
                            {deltaScore.map(({label, newScore, oldScore}) => {
                                const color = colorChange(newScore, oldScore)
                                const change = Math.abs(newScore - oldScore)
                                const sign = newScore > oldScore ? "+" : newScore < oldScore ? "-" : ""
                                return (
                                    <div key={label}>
                                        <div>
                                            <p className={subHeaderStyle}>{label}</p>
                                            <div className="flex flex-row gap-x-2 justify-between">
                                                <div className="flex flex-row gap-x-2 items-center">
                                                    <p className="text-5xl font-semibold">{newScore}</p>
                                                    <MoveRight className="font-semibold text-primary w-10 h-10" strokeWidth={3}/>
                                                    <p className="text-5xl font-semibold">{oldScore}</p>
                                                </div>
                                                {change ? <p className={color}>{sign}{change}</p> : <p></p>}
                                            </div>
                                        </div>
                                    </div>
                            )})}
                        </div>
                    </div>

                </div>

                <div className="flex flex-row space-x-8 ">
                    {/* Topic Breakdown */}
                    <div className="flex-1">
                        <div className="flex flex-col space-y-2">
                            <p className={headerStyle}>Topic Breakdown</p>
                            {Object.entries(topics_mastery).map(([topic, score]) => (
                                <div key={topic} className="pl-4">
                                    <p className={subHeaderStyle}>{topic}</p>
                                    <div className="flex flex-row items-center space-x-8">
                                        <SegmentedProgressBar masteryScore = {score.mastery_score}/>
                                        <p className="text-lg text-primary font-semibold">{score.mastery_score}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="border-r-4 border-secondary"></p>

                    {/* Weaknesses and Strengths */}
                    <div className="flex-1">
                        <div className="flex flex-col space-y-2">
                            <p className={headerStyle}>Weaknesses</p>
                            <div className="pl-4 w-96">
                                {weakSubtopics.map((sub) => (
                                    <div key={sub.subtopic} className="flex flex-row justify-between gap-x-8">
                                        <div className="flex flex-row space-x-1 items-center">
                                            <p className={subHeaderStyle}>{sub.subtopic}</p>
                                            <p className="text-xs text-primary font-bold uppercase mt-1">{(sub.section).slice(0,1)}</p>
                                        </div>
                                        <p className="text-lg text-primary font-semibold">{sub.mastery_score.mastery_score}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}