"use client"

import HelloBanner from "@/components/dashboard/helloBanner"
import useDashboard from "@/hooks/dashboard/useDashboard"
import DashboardCard from "../dashboard/DashboardCard"
import "@/css/animation.css"
import Link from "next/link"
import GlowButton from "../ui/GlowButton"
import TopicMasteryChart from "../progress/TopicMasteryChart"
import { Target, ChartColumnIncreasing, BookOpen, Calculator, Clock, Calendar, ArrowBigRight} from "lucide-react"
import { toTitleCase } from "@/utils/renderFormattedText"
import WeaknessCard from "../progress/WeaknessCard"


export default function DashboardClient2() {

    const uploader = useDashboard()
    if (!uploader) return 

    const cardTitleStyle = "text-lg items-start font-bold uppercase tracking-wide"

    return (
        <div className="flex flex-col gap-4 px-4 pb-4 min-h-[calc(100dvh-8rem)]">

            {/* FIRST ROW : helloBanner and Current & Target Score */}
            <div className="flex flex-row w-full gap-4 items-stretch">
                <HelloBanner
                    fullName={uploader.fullName ?? ""}
                    weeklyGoal={uploader.weeklyGoal ?? 0}
                    timeSpent={Number(uploader.weeklyTimeSpent )?? 0}
                    isLoading={uploader.isLoading}
                />

                <div className="flex flex-col space-y-4 min-w-56 flex-1">
                    <DashboardCard 
                        color={"secondaryOne"} bgColor={"whiteblue"}
                        className="w-full flex flex-row items-center space-x-2" 
                        isLoading={uploader.isLoading}
                    >
                        <ChartColumnIncreasing
                            style={{strokeWidth:2}}
                            className="w-10 h-10 p-1 rounded-lg bg-primary/30 text-primary"
                        />
                        <div>
                            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Current Score</p>
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-2xl font-bold">{uploader.currentScore}</p>
                                {uploader.scoreChange == null ? null : uploader.scoreChange > 0 ? (
                                    <span className="text-lg font-bold text-green-500">+{uploader.scoreChange}</span>
                                ) : uploader.scoreChange < 0 ? (
                                    <span className="text-lg font-bold text-red-500">−{Math.abs(uploader.scoreChange)}</span>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard 
                        color={"secondaryOne"} bgColor={"whiteblue"}
                        className="w-full flex flex-row items-center space-x-2" 
                        isLoading={uploader.isLoading}
                    >
                        <Target
                            style={{strokeWidth:2}}
                            className="w-10 h-10 p-1 rounded-lg bg-orange-500/30 text-orange-500"
                        />
                        <div>
                            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Target Score</p>
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-2xl font-bold">{uploader.targetScore}</p>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* SECOND ROW : Weaknesses, Back to Practice, Daily and Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full min-h-20">
                {/* Weaknesses */}
                <DashboardCard 
                    color="accent"
                    bgColor="accent"
                    className="w-full" 
                    isLoading={uploader.isLoading}
                >
                    <WeaknessCard cardTitleStyle={cardTitleStyle} weakSubtopicBreakdown={uploader.weakSubtopicBreakdown}/>
                </DashboardCard>

                {/* Continue where you left off */}
                <DashboardCard 
                    color="secondary"
                    bgColor="whiteblueOne"
                    className="w-full flex flex-col"
                    isLoading={uploader.isLoading}
                >
                    <div className="flex flex-row space-x-2 items-center mb-1">
                        <ArrowBigRight style={{strokeWidth:2}} className="w-6 h-6 text-primary"/>
                        <p className="uppercase text-lg text-primary font-bold">Back To</p>
                    </div>
                    <GlowButton text={uploader.currentSubtopicAnalytics?.subtopic ?? ""}/>
                    <p className="border-2 border-b border-primary/50 mt-3 mb-1 "></p>
                    <div className="flex flex-col flex-1 items-center justify-evenly">
                        {[
                            {label: "Correct", value: Math.abs((uploader.currentSubtopicAnalytics?.questions_answered.num_questions ?? 0) - (uploader.currentSubtopicAnalytics?.questions_answered.num_incorrect ?? 0))},
                            {label: "Incorrect", value:uploader.currentSubtopicAnalytics?.questions_answered.num_incorrect ?? 0},
                            {label: "Questions", value:uploader.currentSubtopicAnalytics?.questions_answered.num_questions ?? 0},
                            {label: "Mastery Score", value: `${uploader.currentSubtopicAnalytics?.mastery_score.mastery_score ?? 0}%`}
                        ].map(({label, value}) => (
                            <div key={label} className=" w-60 flex flex-row items-center justify-between ml-2">
                                <p className="text-left text-sm font-semibold text-main/90">{label}</p>
                                <p className="text-primary font-bold text-lg text-right">{value}</p>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* Daily and Weekly Goals */}
                <DashboardCard 
                    color="secondary"
                    bgColor="whiteblueOne"
                    className="w-full flex flex-col"
                    isLoading={uploader.isLoading}
                >
                    <div className="flex flex-row space-x-4 items-center mb-1">
                        <Calendar style={{strokeWidth:2}} className="w-6 h-6 text-primary"/>
                        <p className="uppercase text-lg text-primary font-bold">Today Stats</p>
                    </div>
                    {[
                        {label: "Num of Questions", value: uploader.dailyWeeklyStats?.num_questions ?? 0},
                        {label: "Time Spent", value: uploader.dailyWeeklyStats?.time_spent},
                    ].map(({label, value}) => (
                        <div key={label} className="flex-1 flex flex-row justify-between items-center ml-10">
                            <p className="text-left text-sm text-main/90">{label}</p>
                            <p className="text-primary font-bold text-lg">{value}</p>
                        </div>
                    ))}

                    <p className="border-b-3 border-primaryTwo/50 my-3 "></p>

                    <div className="flex flex-row space-x-4 items-center mb-1">
                        <Target style={{strokeWidth:2}} className="w-6 h-6 text-primary"/>
                        <p className="uppercase text-lg text-primary font-bold">Weekly Goal</p>
                    </div>
                    {[
                        {label: "Num of Questions", value: uploader.dailyWeeklyStats?.weekly_num_questions ?? 0},
                        {label: "Time Spent", value: uploader.dailyWeeklyStats?.weekly_time_spent},
                    ].map(({label, value}) => (
                        <div key={label} className="flex-1 flex flex-row justify-between items-center ml-10">
                            <p className="text-left text-sm text-main/90">{label}</p>
                            <p className="text-primary font-bold text-lg">{value}</p>
                        </div>
                    ))}
                </DashboardCard>
            </div>


            {/* THIRD ROW : Section Breakdown and Quiz History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full flex-1">
                {/* Section Breakdown — wrapper owns the column span */}
                <div className="lg:col-span-2 flex">
                    <DashboardCard
                        color="secondary"
                        bgColor="whiteblueOne"
                        className="w-full flex flex-col items-center justify-center"
                        isLoading={uploader.isLoading}
                    >
                        <div className="flex w-full flex-col md:flex-row gap-6 md:items-center">
                            <div className="min-w-0 flex-1">
                                <TopicMasteryChart
                                    title="Reading"
                                    sectionMastery={uploader.readingScore ?? 0}
                                    scores={uploader.readingTopicBreakdown ?? {}}
                                    color="primary"
                                    Icon={BookOpen}
                                />
                            </div>

                            <div className="hidden md:block w-px self-stretch bg-secondaryOne" />

                            <div className="min-w-0 flex-1">
                                <TopicMasteryChart
                                    title="Math"
                                    sectionMastery={uploader.mathScore ?? 0}
                                    scores={uploader.mathTopicBreakdown ?? {}}
                                    color="primary"
                                    Icon={Calculator}
                                />
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* Past Quiz History — no fixed width */}
                <div className="flex">
                    <DashboardCard
                        color="accent"
                        bgColor="accent"
                        className="w-full"
                        isLoading={uploader.isLoading}
                    >
                        <div className="flex flex-row space-x-2 items-center mb-4">
                            <Clock style={{strokeWidth:3}} className="text-orange-500 w-6 h-6"/>
                            <p className={`text-orange-500 ${cardTitleStyle}`}>Quiz History</p>
                        </div>
                        {uploader.pastQuizAnalytics?.length
                            ? uploader.pastQuizAnalytics.map((quiz) => (
                                <div key={quiz.session_id} className="flex flex-row justify-between px-4 items-center">
                                    <p className="tracking-wide font-semibold text-base">{toTitleCase(quiz.section)}</p>
                                    <p className="text-gray-500 text-sm">{new Date(quiz.completed_at).toLocaleDateString()}</p>
                                    <p className="font-bold text-orange-500 text-xl">{quiz.section_mastery.mastery_score}%</p>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center h-full mt-8 gap-2">
                                    <span className="text-2xl">🎉</span>
                                    <span className="text-slate-600 font-semibold">No quiz history yet — take a quiz!</span>
                                </div>
                            )
                        }
                    </DashboardCard>
                </div>
            </div>
        </div>
    )
}