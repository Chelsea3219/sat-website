"use client"

import Link from "next/link";
import { Question, QuestionTabProps } from "@/types/questions"
import { ProgressBar } from "../ProgressBar";
import "../../../css/tab-window.css"
import MathQuestionTab from "./MathQuestionTab"
import ReadingQuestionTab from "./ReadingQuestionTab";


type TabWindowProps = {
    section: string
    activeTab: "Reading" | "Math"
    currentQuestion: Question
    progress: {
        completedQuestions: number
        numQuestions: number
    }
}

export default function QuizTabWindow({section, activeTab, currentQuestion, progress}: TabWindowProps) {
    return (
        <>
            <div className="tab-window h-full flex flex-col">

                {/* Header */}
                <div role="tablist" className="header shrink-0 flex itmes-end justify-between px-4 gap-1 w-full">

                    {/* Tabs */}
                    <div className="flex items-end gap-1">
                        {["Reading", "Math"].map((tab, index) => {
                            const isDisabled = tab !== activeTab
                            const href = `/dashboard/quiz/${tab.toLowerCase()}`
                            return (
                                <div key={tab} className="flex items-center">
                                    <Link
                                        href={href}
                                        role={tab}
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

                                    
                                </div>
                            )
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center w-48">
                        <ProgressBar completed={progress.completedQuestions} numQuestions={progress.numQuestions}/>
                    </div>

                </div>


                {/* Tab Context */}
                <div role="tabpanel" className="p-4 flex-1 h-full">
                    {activeTab === "Reading" && <ReadingQuestionTab/>}
                    {activeTab === "Math" &&
                        <div className="flex-1 overflow-y-auto scrollbar-thin">
                            <MathQuestionTab/>
                            {currentQuestion.text}
                        </div>
                    }
                </div>
                
            </div>
        </>
    )
}