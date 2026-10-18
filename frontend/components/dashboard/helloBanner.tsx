import Lottie from "lottie-react"
import owlAnimation from "@/public/dashboard/lottie/Smiling Owl.json"
import { getRandomEncouragments } from "@/utils/motivations"
import "@/css/animation.css"


type HelloBannerProps = {
    fullName: string 
    weeklyGoal: number
    timeSpent: number
    isLoading: boolean
}

export default function HelloBanner(
    { fullName, weeklyGoal, timeSpent, isLoading }: HelloBannerProps
) {
    const percent = (timeSpent / (weeklyGoal * 60)) * 100
    const message = getRandomEncouragments()

    return (
        <div
            className={`
                relative w-full h-full rounded-lg border-2 border-secondaryOne md:border-secondary overflow-hidden px-4 flex flex-row justify-between items-center
                ${isLoading ? "animate-shine" : ""}
            `}
        >
            {!isLoading ? (
                <>
                    <div className="hidden md:flex">
                        <div
                            className="absolute inset-0 bg-cover bg-center h-full"
                            style={{ backgroundImage: "url('/dashboard/hello-banner.svg')" }}
                        />
                    </div>
                    <div className="flex flex-row items-center w-full h-full relative z-10">
                        <Lottie
                            animationData={owlAnimation}
                            className="w-40 h-40 hidden md:flex"
                            loop={true}
                        />
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-x-1 ">
                                <h2 className="text-primary md:text-orange-500 text-2xl font-semibold">Welcome</h2>
                                <h2 className="hidden md:block text-orange-500 text-2xl font-semibold">{fullName}!</h2>

                            </div>
                            <p className="text-base">
                                You&apos;ve completed{" "}
                                <span className="text-primary text-lg font-bold">{Math.round(percent)}%</span>
                                {" "}of your goal this week!
                            </p>
                            <p className="text-base">{message}</p>
                        </div>
                    </div>
                </>
            ) : (
                <div></div>
            )}
        </div>
    )
}