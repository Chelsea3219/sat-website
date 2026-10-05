"use client"

import Lottie from "lottie-react"
import owlAnimation from "@/public/dashboard/lottie/Thumbs up birdie.json"
import ProgressCard from "../progress/ProgressCard"
import ProgressBarSemicircle from "../progress/ProgressBarSemicircle"
import LoginCalendarTracker from "../progress/LoginCalendarTracker"
import TopicMasteryChart from "../progress/TopicMasteryChart"
import ProgressHistogramChart from "../progress/ProgressHistogramChart"
import useProgress from "@/hooks/dashboard/useProgress"
import Link from "next/link"
import { formatMinutes, toTitleCase} from "@/utils/renderFormattedText"
import DashboardCard from "../dashboard/DashboardCard"
import "@/css/buttons.css"
import { Calculator, BookOpen, Compass} from "lucide-react"
import WeaknessCard from "../progress/WeaknessCard"
import Achievements from "../progress/Acheivements"

export default function ProgressClient() {
    // TODO make a sleepting loading Owl Animation
    // TODO make a page redirecting the user to the quiz if the overall mastery score is zero

    const uploader = useProgress()
    
    const nextSubtopic = uploader.weakSubtopicBreakdown?.at(1)
    // TODO add a helper function to determine the main subtopic for the weaknesses 

    // Guard against a new user
    // TODO design an UI
    if (uploader.isNewUser) {
        return <div className="flex items-center justify-center">Not enough analytics. Take an quiz assessment.</div>
    }
    const cardTitleStyle = "text-lg items-start font-bold uppercase tracking-wide"

    return (
        <>
            {/* */}

            <div className="flex flex-col gap-4 px-4 pb-4 min-h-[calc(100dvh-6rem)]">
                {/* FIRST ROW : Student's Overall Performance and Consistency */}
                <div className="flex flex-row items-stretch w-full h-52 gap-4">
                    {/* Owl Animation */}
                    <DashboardCard 
                            color={"secondaryOne"} bgColor={"white"}
                            className="flex items-center justify-center w-full" 
                            isLoading={uploader.isLoading}
                            style={{
                                backgroundColor: "#faf8ff",
                                backgroundImage: "radial-gradient(#d9d0ff 1.2px, transparent 1.2px)",
                                backgroundSize: "18px 18px",
                            }}
                        >
                            <div className="h-full max-h-72 aspect-square overflow-hidden rounded-xl " style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: 12 }}>
                                <Lottie animationData={owlAnimation} className="w-full h-full scale-135" loop />
                            </div>
                    </DashboardCard>

                    {/* Current Score AND Overall Perfomance */}
                    <ProgressCard color="primary" isLoading={uploader.isLoading} cardClassName="" className="flex-1 basis-0" style={{width: 500}}>
                        <p className={`text-primary text-center ${cardTitleStyle}`}>Overall Performance</p>
                        <div className="flex items-center justify-center">
                            <ProgressBarSemicircle
                                satScore={uploader.currentSATScore ?? 400}
                                masteryScore={uploader.masteryScore ?? 0}
                                pointChange={uploader.deltaScore ?? 0}
                            />
                        </div>
                    </ProgressCard>

                    {/* Total hours spent AND Total questions answered AND total quizzes taken */}
                    <div className="flex flex-col space-y-4 flex-1 basis-0 min-h-0 items-stretch">
                        <ProgressCard color="orange-500" isLoading={uploader.isLoading} className="flex-1 basis-0">
                            <div className="flex flex-col space-y-1 w-full px-2">
                                {[
                                    {label: "Total Questions", value: uploader.numQuestions}, 
                                    {label: "Accuracy Rate %", value: uploader.accuracyRate}
                                ].map(({label, value}) => (
                                    <div
                                        key={label}
                                        className = "flex items-center justify-between"
                                    >
                                        <div className="text-sm font-semibold text-gray-600 uppercase"> {label} </div>
                                        <div className="font-bold text-lg border-orange-500 text-orange-500"> {value} </div>

                                    </div>
                                ))}
                            </div>
                        </ProgressCard>

                        <ProgressCard color="orange-500" isLoading={uploader.isLoading} className="flex-1 basis-0">
                            <div className="flex flex-col space-y-1 w-full px-2">
                                {[
                                    {label: "Time Spent", value: formatMinutes((uploader.timeSpent ?? 0), true)}, 
                                    {label: "Quizzes Taken", value: uploader.numQuizzes}
                                ].map(({label, value}) => (
                                    <div
                                        key={label}
                                        className = "flex items-center justify-between"
                                    >
                                        <div className="text-sm font-semibold text-gray-600 uppercase"> {label} </div>
                                        <div className="font-bold text-lg border-orange-500 text-orange-500"> {value} </div>

                                    </div>
                                ))}
                            </div>
                        </ProgressCard>
                    </div>

                    {/* Calendar Tracker */}
                    <ProgressCard color="primary" isLoading={uploader.isLoading} className="flex-1 basis-0">
                        <LoginCalendarTracker loggedDays={uploader.loggedDatesOnly}/>
                    </ProgressCard>

                </div>

                {/* SECOND ROW : Reading and Math Mastery Scores by topic */}
                {/* <div className="flex flex-row items-stretch w-full h-60 gap-4"> */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full flex-1">
                    {/* Achievements */}
                    <ProgressCard 
                            color="accent" 
                            isLoading={uploader.isLoading} 
                            className="flex flex-1 flex-col "
                    >
                        <Achievements achievements={uploader.achievements ?? []} cardTitleStyle={cardTitleStyle}/>
                    </ProgressCard>

                    {/* Reading and Math Mastery Scores by topic */}
                    <div className="flex flex-row space-x-4 w-190">
                        {/* Reading */}
                        <ProgressCard 
                            color="secondary" 
                            isLoading={uploader.isLoading} 
                            className="flex flex-1 "
                        >
                            <div className="flex flex-col justify-center w-full ">
                                <TopicMasteryChart
                                    title = "Reading"
                                    sectionMastery={uploader.readingScore ?? 200}
                                    scores = {uploader.readingTopicBreakdown ?? {}}
                                    color="primary"
                                    Icon={BookOpen}
                                />
                            </div>
                        </ProgressCard>

                        {/* Math */}
                        <ProgressCard 
                            color="secondary" 
                            isLoading={uploader.isLoading} 
                            className="flex flex-1 "
                        >
                            <div className="flex flex-col justify-center w-full ">
                                <TopicMasteryChart
                                    title = "Math"
                                    sectionMastery={uploader.mathScore ?? 200}
                                    scores = {uploader.mathTopicBreakdown ?? {}}
                                    color="primary"
                                    Icon={Calculator}
                                />
                            </div>
                        </ProgressCard>
                    </div>
                </div>

                {/* THIRD ROW : Performance Trend and Weaknesses */}
                <div className="grid grid-cols-[2.8fr_1fr_0.8fr] gap-4 w-full flex-1">

                    {/* Performance Trend */}
                    <div className="flex w-full">
                        <ProgressCard 
                            color="secondary" 
                            isLoading={uploader.isLoading} 
                            className="flex flex-1 w-1/2"
                        >
                            {!uploader.trendData || uploader.trendData?.length >=5
                                ? (
                                    <ProgressHistogramChart trendData={(uploader.trendData ?? []).slice(-10)}/>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center space-y-2">
                                        <p className="text-2xl font-bold ">Not enough information yet</p>
                                        <p className="">Practice more questions to see your progress over time.</p>
                                        <Link
                                            href="/dashboard/quiz"
                                            className=" buttonOne">
                                                Take a Quiz!
                                        </Link>
                                    </div>
                                )}
                        </ProgressCard>
                    </div>


                    {/* Weaknesses */}
                    <ProgressCard color="orange-500" isLoading={uploader.isLoading} className="flex flex-col flex-1">
                        <WeaknessCard cardTitleStyle={cardTitleStyle} weakSubtopicBreakdown={uploader.weakSubtopicBreakdown}/>
                    </ProgressCard>


                    {/* TODO : UI  */}
                    <ProgressCard color="primary" isLoading={uploader.isLoading} className="flex flex-col bg-[#F8F7FF] p-2 space-y-4">
                        <div className="flex items-center gap-x-2 mb-4">
                            <Compass style={{ strokeWidth: 2 }} className="w-6 h-6 text-primary shrink-0" />
                            <p className={`text-primary ${cardTitleStyle}`}>Next Topic</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Focus on</p>
                            <p className="text-2xl font-bold text-main leading-tight mt-1">
                                {toTitleCase(nextSubtopic?.subtopic ?? "")}
                            </p>
                        </div>

                        <Link
                            href={`/dashboard/practice/${nextSubtopic?.section}/${nextSubtopic?.topic}/${nextSubtopic?.subtopic}`}
                            className="mt-4 w-full rounded-xl bg-primary py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 transition"
                        >
                            Practice Now
                        </Link>
                    </ProgressCard>
                </div>
            </div>

        </>
    )
}