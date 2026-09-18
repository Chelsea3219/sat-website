"use client"


import ProgressCard from "../ui/progress/ProgressCard"
import HorizontalLoadingAnimation from "../ui/loading-animation/HorizontalLoadingAnimation"
import ProgressBarSemicircle from "../ui/progress/ProgressBarSemicircle"
import LoginCalendarTracker from "../ui/progress/LoginCalendarTracker"
import TopicMasteryChart from "../ui/progress/TopicMasteryChart"
import ProgressHistogramChart from "../ui/progress/ProgressHistogramChart"
import WeaknessCard from "../ui/progress/WeaknessCard"
import useProgress from "@/hooks/dashboard/useProgress"


export default function ProgressClient() {
    // TODO make a sleepting loading Owl Animation
    // TODO make a page redirecting the user to the quiz if the overall mastery score is zero

    const data = useProgress()
    
    // Loading
    if (data.isLoading) {
        return (
            <div>
                <HorizontalLoadingAnimation text={"Loading Student's Information"}/>
            </div>
        )
    }

    // Guard against a new user
    // TODO design an UI
    if (data.isNewUser) {
        return <div className="flex items-center justify-center">Not enough analytics. Take an quiz assessment.</div>
    }

    // Declare the variables 
    const {
        readingScore, mathScore, masteryScore, 
        readingSATScore, mathSATScore,
        deltaScore,
        readingTopicsScore, mathTopicsScore, 
        numQuestions, numCorrect, numQuizzes, timeSpent,
        loggedDatesOnly, trendData,
        weaknesses
    } = data 

    return (
        <>
            {/* */}
            <div className = "p-4">
                <div className="space-y-4">

                    {/* Student's Overall Performance and Consistency */}
                    <div className="flex flex-row items-stretch w-full gap-4">

                        {/* Current Score AND Overall Perfomance */}
                        <ProgressCard>
                            <p className="uppercase text-xl text-center text-gray-600 font-bold">Overall Performance</p>
                            <div className="flex items-center justify-center">
                                <ProgressBarSemicircle
                                    satScore={readingSATScore+mathSATScore}
                                    masteryScore={masteryScore}
                                    pointChange={deltaScore}
                                />
                            </div>
                        </ProgressCard>

                        {/* Total hours spent AND Total questions answered AND total quizzes taken */}
                        <ProgressCard>
                            <div className="flex flex-col space-y-4 w-full">
                                {[
                                    {label: "Total Questions", value: numQuestions}, 
                                    {label: "Hours Spent", value: Math.round(timeSpent/3600)}, 
                                    {label: "Quizzes Taken", value: numQuizzes}, 
                                    {label: "Accuracy Rate %", value: Math.round(numCorrect/numQuestions)}
                                ].map(({label, value}) => (
                                    <div
                                        key={label}
                                        className = "flex items-center justify-between"
                                    >
                                        <div className="text-md font-semibold text-gray-600 uppercase"> {label} </div>
                                        <div className="circleWrapper text-lg border-accent text-accent"> {value} </div>

                                    </div>
                                ))}
                            </div>
                        </ProgressCard>

                        {/* Calendar Tracker */}
                        <ProgressCard>
                            <LoginCalendarTracker loggedDays={loggedDatesOnly}/>
                        </ProgressCard>

                    </div>

                    {/* Reading and Math Mastery Scores by topic */}
                    <div className="flex flex-row items-stretch w-full gap-4">
                        <ProgressCard>
                            <TopicMasteryChart
                                title = "Reading"
                                sectionMastery={readingScore}
                                scores = {readingTopicsScore}
                            />
                        </ProgressCard>

                        <ProgressCard>
                            <TopicMasteryChart
                                title = "Math"
                                sectionMastery={mathScore}
                                scores = {mathTopicsScore}
                            />
                        </ProgressCard>
                    </div>

                    {/* Performance Trend and Weaknesses */}
                    <div className="flex flex-row items-stretch w-full gap-4">
                        <div className="flex-2">
                            <ProgressCard>
                                <p className="uppercase text-xl text-gray-600 font-bold">Performance Trend</p>
                                <ProgressHistogramChart trendData={trendData.slice(-10)}/>
                            </ProgressCard>
                        </div>

                        <ProgressCard>
                            <WeaknessCard weaknesses={weaknesses ?? {}}/>
                        </ProgressCard>
                    </div>
                </div>
            </div>
        </>
    )
}