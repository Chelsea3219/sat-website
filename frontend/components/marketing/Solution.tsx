
import WavyBackground from "../ui/WavyBackground";
import { Pencil, Activity, TrendingUp, ArrowRight} from "lucide-react";
import "@/css/animation.css"


export default function Solution() {

    const cardClass = "flex-1 rounded-xl bg-white p-4 pt-6 w-60 h-48 ring-8 ring-white ring-offset-6 ring-offset-[#8a7de8]"

    return (
            <section className="relative w-screen left-1/2 right-1/2 mx-[-50vw] pt-32 pb-32 text-center ">
                <WavyBackground/>

                <div className="relative z-10 max-w-4xl mx-auto flex items-center flex-col space-y-2">
                    
                    <div className="text-md sm:text-lg md:text-xl font-semibold rounded-full bg-green-100 text-green-600 px-4 py-2 border-2 border-green-600">
                        That&apos;s where we come in.
                    </div>

                    <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white text-center">
                        Turn Practice into Progress
                    </div>

                    <div className="italic text-white font-semibold"
                    >
                        Our platform helps you UNDERSTAND your performance,{" "}
                        <br className="sm:hidden" /> {/* forces a line break on mobile, hides it on sm and above*/}
                        FOCUS on what matter, {" "}
                        <br className="sm:hidden" />
                        and BUILD a smarter study plan.
                    </div>

                    <div className="flex items-center flex-row space-x-8 pt-4">
                        <div className={cardClass}>
                            <div className="flex flex-row items-center space-x-1">
                                <Pencil className="text-primary w-8 h-8"/>
                                <p className="text-primary font-bold text-3xl">Practice</p>
                            </div>
                            <p className="pt-4 text-primary font-semibold">Work through SAT Reading & Writing and Math questions.</p>
                        </div>

                        <ArrowRight 
                            className="arrow-flow w-18 h-24 text-white shrink-0"
                            strokeWidth="3"
                            style={{ animationDelay: "0s" }}
                        />

                        <div className={cardClass}>
                            <div className="flex flex-row items-center space-x-1">
                                <Activity className="text-primary w-8 h-8"/>
                                <p className="text-primary font-bold text-3xl">Analyze</p>
                            </div>
                            <p className="pt-4 text-primary font-semibold">Review your performance to see your strengths and areas for improvement.</p>
                        </div>

                        <ArrowRight 
                            className="arrow-flow w-18 h-24 text-white shrink-0"
                            strokeWidth="3"
                            style={{ animationDelay: "0.3s" }}
                        />
                        
                        <div className={cardClass}>
                            <div className="flex flex-row items-center space-x-1">
                                <TrendingUp className="text-primary w-8 h-8"/>
                                <p className="text-primary font-bold text-3xl">Improve</p>
                            </div>
                            <p className="pt-4 text-primary font-semibold">Use targeted practice to focus on the skills that need the most attent</p>
                        </div>
                    </div>

                </div>
            </section>
        )
    }