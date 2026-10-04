"use client"

import HelloBanner from "@/components/dashboard/helloBanner"
import useDashboard from "@/hooks/dashboard/useDashboard"
import DashboardCard from "../dashboard/DashboardCard"
import "@/css/animation.css"
import Link from "next/link"
import GlowButton from "../ui/GlowButton"
import TopicMasteryChart from "../progress/TopicMasteryChart"
import { Target, ChartColumnIncreasing} from "lucide-react"
import { toTitleCase } from "@/utils/renderFormattedText"


export default function DashboardClient() {

    const uploader = useDashboard()
    if (!uploader) return 

    const cardTitleStyle = "text-lg items-start font-bold uppercase tracking-wide"

    return (
        <div className="space-y-4 px-4">

            {/* FIRST ROW : helloBanner and Current & Target Score */}
            <div className="flex flex-row w-full space-x-4 items-stretch">
                <HelloBanner
                    fullName={uploader.fullName ?? ""}
                    weeklyGoal={uploader.weeklyGoal ?? 0}
                    timeSpent={100}
                    isLoading={uploader.isLoading}
                />
                <div className="flex flex-col space-y-4 min-w-56 flex-1">
                    {[
                        {label: "Current Score", value: uploader.currentScore ?? 200, color:"primaryOne", Icon: ChartColumnIncreasing},
                        {label: "Target Score", value: uploader.targetScore ?? 200, color:"secondary", Icon: Target}
                    ].map(({label, value, color, Icon}) => (
                        <div key={label} className="flex flex-1">
                            <DashboardCard color={color} className="w-full flex flex-row items-center space-x-2" isLoading={uploader.isLoading}>
                                <Icon 
                                    style={{ Color: `var(--color-${color})`, backgroundColor: `color-mix(in srgb, var(--color-${color}) 30%, transparent)` } as React.CSSProperties}
                                    className="w-12 h-12 p-1 rounded-lg" />
                                <div>
                                    <p className="text-sm font-semibold text-primary uppercase tracking-wide">{label}</p>
                                    <p className="text-2xl font-bold">{value}</p>
                                </div>
                            </DashboardCard>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECOND ROW : Weaknesses, Back to Practice, Daily and Weekly Progress */}
            <div className="flex flex-row space-x-4 w-full h-50">
                {/* Weaknesses */}
                <DashboardCard color="accent" className="w-full" isLoading={uploader.isLoading}>
                    <p className={`text-accent ${cardTitleStyle}`}>Weaknesess</p>
                    {uploader.weakSubtopicBreakdown?.map((sub) => (
                        <div key={sub.subtopic} className="flex flex-row justify-between items-center space-y ml-2">
                            <div className="flex flex-row space-x-1">
                                <Link
                                    href={`/dashboard/practice/${sub.section}/${sub.topic}/${sub.subtopic}`}
                                    className = "text-sm hover:text-primary hover:font-bold cursor-pointer"
                                >
                                    {sub.subtopic}
                                </Link>
                                <p className="text-xs text-accent font-bold mt-1 uppercase">{sub.section.slice(0,1)}</p>
                            </div>
                            <div>
                                <p className=" text-xs font-semibold">{sub.mastery_score.mastery_score}%</p>
                            </div>
                        </div>
                    ))}
                </DashboardCard>

                {/* Continue where you left off */}
                <DashboardCard color="primaryOne" className="w-full" isLoading={uploader.isLoading}>
                    <p className={`text-primaryOne ${cardTitleStyle}`}>Back to</p>
                    <GlowButton text={uploader.currentSubtopicAnalytics?.subtopic ?? ""}/>
                    <p className="border-2 border-b border-primary/50 mt-3 mb-1 "></p>
                    <div className="flex flex-col items-center">
                        {[
                            {label: "Correct", value: Math.abs((uploader.currentSubtopicAnalytics?.questions_answered.num_questions ?? 0) - (uploader.currentSubtopicAnalytics?.questions_answered.num_incorrect ?? 0))},
                            {label: "Incorrect", value:uploader.currentSubtopicAnalytics?.questions_answered.num_incorrect},
                            {label: "Questions", value:uploader.currentSubtopicAnalytics?.questions_answered.num_questions},
                            {label: "Mastery Score", value: `${uploader.currentSubtopicAnalytics?.mastery_score.mastery_score}%`}
                        ].map(({label, value}) => (
                            <div key={label} className=" w-40 flex flex-row items-center justify-between ml-2">
                                <p className="text-left text-sm font-semibold text-main/90">{label}</p>
                                <p className="text-primaryOne font-bold text-lg">{value}</p>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* Daily and Weekly Goals */}
                <DashboardCard color="primaryTwo" className="w-full" isLoading={uploader.isLoading}>
                    <p className={`text-primaryTwo ${cardTitleStyle}`}>Today stats</p>
                    {[
                        {label: "Num of Questions", value: uploader.dailyWeeklyStats?.num_questions ?? 0},
                        {label: "Time Spent", value: uploader.dailyWeeklyStats?.time_spent},
                    ].map(({label, value}) => (
                        <div key={label} className="flex flex-row justify-between items-center ml-2">
                            <p className="text-left text-sm font-semibold text-main/90">{label}</p>
                            <p className="text-primaryTwo font-bold text-lg">{value}</p>
                        </div>
                    ))}
                    <p className="border-b-3 border-primaryTwo/50 mt-3 mb-1 "></p>
                    <p className={`text-primaryTwo ${cardTitleStyle}`}>Weekly Goals</p>
                    {[
                        {label: "Num of Questions", value: uploader.dailyWeeklyStats?.weekly_num_questions ?? 0},
                        {label: "Time Spent", value: uploader.dailyWeeklyStats?.weekly_time_spent},
                    ].map(({label, value}) => (
                        <div key={label} className="flex flex-row justify-between items-center ml-2">
                            <p className="text-left text-sm font-semibold text-main/90">{label}</p>
                            <p className="text-primaryTwo font-bold text-lg">{value}</p>
                        </div>
                    ))}
                </DashboardCard>
            </div>

            {/* THIRD ROW : Section Breakdown and Quiz History */}
            <div className="flex flex-row space-x-3 w-full h-60">
                {/* Section Breakdown */}
                <DashboardCard color="secondaryOne" className="flex flex-row space-x-2 w-full items-center" isLoading={uploader.isLoading}>
                    <div className="flex flex-row space-x-4 w-full">
                        <TopicMasteryChart
                            title = "Reading"
                            sectionMastery={uploader.readingScore ?? 200}
                            scores = {uploader.readingTopicBreakdown ?? {}}
                            color="secondaryOne"
                        />
                        <p className="border-l-3 my-2"></p>
                        <TopicMasteryChart
                            title = "Math"
                            sectionMastery={uploader.mathScore ?? 200}
                            scores = {uploader.mathTopicBreakdown ?? {}}
                            color="secondaryOne"
                        />
                    </div>
                </DashboardCard>

                {/* Past Quiz History */}
                <div>
                    <DashboardCard color="orange-500" className="flex flex-1 flex-col min-w-50" isLoading={uploader.isLoading}>
                        <p className={`text-orange-500 ${cardTitleStyle}`}>Quiz history</p>
                        {uploader.pastQuizAnalytics 
                            ?   (
                                (uploader.pastQuizAnalytics ?? []).map((quiz) => (
                                    <div key={quiz.session_id} className="flex flex-row space-x-4 ml-2 items-center">
                                        <p className="tracking-wide font-semibold">{toTitleCase(quiz.section)}</p>
                                        <p>{new Date(quiz.completed_at).toLocaleDateString()}</p>
                                        <p className="font-bold text-orange-500 text-xl">{quiz.section_mastery.mastery_score}%</p>

                                    </div>
                                )))
                            : "Not enough information"
                        }
                    </DashboardCard>
                </div>
            </div>


            <div className="flex flex-row space-x-3 ">
                <DashboardCard color="accent" className="" isLoading={uploader.isLoading}>
                    Past Quiz History
                </DashboardCard>
                <DashboardCard color="secondary" className="" isLoading={uploader.isLoading}>
                    achievements
                </DashboardCard>
            </div>
            
        </div>
    )
}