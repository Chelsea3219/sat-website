

import AnswerTab from "./AnswerTab";
import ReviewTab from "./ReviewTab";
import Link from "next/link"
import {QuestionTabProps} from "@/types/questions"
import ReadingQuestionTab from "../ReadingQuestionTab";
import MathQuestionTab from "../MathQuestionTab";

type TabWindowProps = {
    section: string
    topic: string
    subtopic: string
    activeTab: "Review" | "Questions" | "Answer"
    score:number // TODO: fix this so that is add the previous score

    questionTabProps: QuestionTabProps
}



export default function PracticeTabWindow({section, topic, subtopic, activeTab, questionTabProps, score}:TabWindowProps) {

    const base = `/dashboard/practice/${section}/${topic}/${subtopic}`
    const tabs = ["Review", "Questions", "Answer"]

    const numAttempts = questionTabProps.numAttempts ?? 0

    return (
        <div className="tabwindow h-full flex flex-col ">

            {/* File Tabs */}
            <div role="tablist" className="header shrink-0 flex items-end justify-between px-4 gap-1 w-full">
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

                <div className="py-1 px-3 border-2 rounded-2xl border-primary bg-white mb-1 text-primary">
                    Score: {score}
                </div>
            </div>

            {/* Tab Context */}
            <div role="tabpanel" className="p-4 flex-1 h-full">
                {activeTab === "Review" && <ReviewTab subtopic={subtopic}/>}
                {activeTab === "Questions" &&
                    questionTabProps.currentQuestion &&
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                        <>
                            {section === "reading" && <ReadingQuestionTab/>}
                            {section === "math" &&
                                <div className="flex-1 overflow-y-auto scrollbar-thin">
                                    <MathQuestionTab
                                        currentQuestion={questionTabProps.currentQuestion}
                                        answer={questionTabProps.answer}
                                        answerChangeAction={questionTabProps.answerChangeAction}
                                        checkAnswerAction={questionTabProps.checkAnswerAction}
                                        timeElapsed={questionTabProps.timeElapsed}
                                    />
                                </div>
                            }

                        </>
                    </div>
                }
                {activeTab === "Answer"
                    && questionTabProps.currentQuestion
                    && <AnswerTab questionId={questionTabProps.currentQuestion.question_id}/>
                }
            </div>
        </div>
    )
}