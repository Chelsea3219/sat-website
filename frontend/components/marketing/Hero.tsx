import Image from "next/image"

export default function Hero() {
    return(
        <section className="max-w-7xl mx-auto text-center relative w-full pb-24">
            <div className="max-w-7xl mx-auto text-center gap-4 sm:gap-6 lg:gap-10 items-center relative space-y-4">

                {/* Hero Text */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900"
                >
                    Smarter Practice,{" "}
                    <br className="sm:hidden" /> {/* forces a line break on mobile, hides it on sm and above*/}
                    Better Scores.
                </div>

                {/* Hero Motto */}
                <div className=" italic">
                    <p>Personalized SAT practice for Math and Reading & Writing that helps you</p>
                    <p>identify your weaknesses, strengthen your skills, and track your progress.</p>
                </div>

                {/* Hero Image */}
                <div>
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

            </div>
        </section>
    )
}