import Image from "next/image"
import GuestLoginButton from "@/components/ui/buttons/GuestLoginButton"

export default function Hero() {
    return(
        <section className="w-full bg-white px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 sm:gap-4 lg:gap-6">

                    {/* Hero Text */}
                    <div className="flex items-center flex-col">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 text-center pb-1"
                        >
                            Smarter Practice,{" "}
                            <br className="sm:hidden" /> {/* forces a line break on mobile, hides it on sm and above*/}
                            Better Scores.
                        </div>
                        {/* Hero Motto */}
                        <div className="w-fll max-w-xl md:max-w-3xl px-4">
                            <p className=" text-center leading-relaxed italic">
                                Personalized SAT practice for Math and Reading & Writing that helps you identify your weaknesses, strengthen your skills, and track your progress.
                            </p> 
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full max-w-3xl md:max-w-7xl">
                        {/* Hero Image <img src = "/hero_image.svg" alt="Hero Image" className="w-full"/> */}
                        <Image
                            src = "/marketing/hero-image-cropped.svg"
                            alt="Hero Image"
                            width={800} height={800}
                            className="w-full h-auto"
                        />
                        <p className={"text-[10px] text-muted text-center"}>
                            <a href="https://storyset.com/education" className="text-gray-400">Education Illustrations by Storyset</a>
                        </p>
                    </div>

                    <GuestLoginButton />
                    
            </div>
        </section>
    )
}