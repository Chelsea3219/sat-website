
import AnswerTab from "./AnswerTab";
import ReviewTab from "./ReviewTab";
import Link from "next/link"
import {PracticeQuestionTabProps} from "@/types/questions"
import { SessionProgress, SubtopicMastery} from "@/types/students";
import { PracticeGradedResponse } from "@/types/mastery-score";
import ReadingQuestionTab from "../ReadingQuestionTab";
import MathPracticeTab from "./MathPracticeTab";
import { ProgressBar } from "../../ProgressBar";
//import {ArrowUp, ArrowDown} from "lucide-react"
import HorizontalLoadingAnimation2 from "../../loading-animation/HorizontalLoadingAnimation";
import PracticeResults from "./PracticeResults";


type TabWindowProps = {
    section: string
    topic: string
    subtopic: string
    activeTab: "Review" | "Questions" | "Answer"
    progress: SessionProgress
    questionTabProps: PracticeQuestionTabProps
    isLoading: boolean
    practiceResults: PracticeGradedResponse | null
    pastSubtopicMastery: SubtopicMastery[] | undefined
}



export default function PracticeTabWindow({
    section, topic, subtopic, activeTab, questionTabProps, progress, isLoading, practiceResults, pastSubtopicMastery
}:TabWindowProps) {

    const base = `/dashboard/practice/${section}/${topic}/${subtopic}`
    const tabs = ["Review", "Questions", "Answer"]

    const numAttempts = questionTabProps.numAttempts ?? 0

    return (
        <div className="tabwindow h-full flex flex-col ">

            {/* Tab Header */}
            <div role="tablist" className="header shrink-0 flex items-end justify-between px-4 gap-1 w-full">

                {/* File Tabs */}
                <div className="flex items-end gap-1">
                    {tabs.map((tab, index) => {
                        const isDisabled = tab === "Answer" && numAttempts < 2
                        return (
                            <div key={tab} className="flex items-center">
                                <Link
                                    key={tab}
                                    href={isDisabled ? "#" : `${base}?tab=${tab}`}
                                    role="tab"
                                    aria-selected={activeTab === tab}
                                    aria-disabled={isDisabled}
                                    onClick={e => isDisabled && e.preventDefault()}
                                    className={`tabs 
                                        ${activeTab === tab ? "tabs-selected" : ""} 
                                        ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {tab}
                                </Link>

                                {index < tabs.length - 1 && activeTab !== tab && activeTab !== tabs[index + 1] && (
                                    <span className="text-primary px-1 text-xl ">|</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mastery and Progress */}
                <div className="flex items-center w-60 shrink-0 self-center">
                    {!practiceResults
                        ? (
                            <div className="flex items-center space-x-2 w-full min-w-0">
                                <ProgressBar completed={progress.numCompleted} numQuestions={progress.numQuestions ?? 0} showProgress={false}/>
                                {/* TODO 
                                    {progress.trend === "up" && <ArrowUp className="opacity-50"/>}
                                    {progress.trend === "down" && <ArrowDown className="opacity-50"/>}
                                s */}
                                <p className="text-primary font-semibold">{Math.round(progress.masteryScore ?? 0) ?? "-"}%</p>
                                
                            </div>
                        ): <div> </div>
                    }
                </div>
            </div>

            {/* Tab Context */}
            <div role="tabpanel" className="p-4 flex-1 h-full">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <HorizontalLoadingAnimation2 text="Loading Questions"/>
                    </div>
                ): (
                    <>
                        {activeTab === "Review" && <ReviewTab subtopic={subtopic}/>}
                        {activeTab === "Questions" && (
                            <div className="flex-1 overflow-y-auto scrollbar-thin">
                                {practiceResults ? (
                                    <PracticeResults topic={topic} subtopic={subtopic} practiceResults={practiceResults} pastSubtopicMastery={pastSubtopicMastery ?? []}/>
                                ) : questionTabProps.currentQuestion ? (
                                    <>
                                        {section === "reading" && <ReadingQuestionTab/>}
                                        {section === "math" &&
                                            <MathPracticeTab
                                                currentQuestion={questionTabProps.currentQuestion}
                                                answer={questionTabProps.answer}
                                                numAttempts={questionTabProps.numAttempts}
                                                answerChangeAction={questionTabProps.answerChangeAction}
                                                checkAnswerAction={questionTabProps.checkAnswerAction}
                                                timeElapsed={questionTabProps.timeElapsed}
                                                nextQuestion={questionTabProps.nextQuestion}
                                                checkHintAction={questionTabProps.checkHintAction}
                                                isCorrect={questionTabProps.isCorrect}
                                            />
                                        }
                                    </>
                                    ) : (
                                        <p className="text-center text-gray-500">No questions available.</p>
                                    )}
                            </div>
                            )}
                        {activeTab === "Answer"
                            && questionTabProps.currentQuestion
                            && <AnswerTab questionId={questionTabProps.currentQuestion.question_id}/>
                        }
                    </>
                )}
            </div>
        </div>
    )
}