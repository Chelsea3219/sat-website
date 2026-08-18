import {CircleArrowLeft} from "lucide-react"
import Link from "next/link"

export default function WhyMe() {
    const miniSynposis = [
        {
            paragraphId: 1, 
            content: `I'm Chelsea, a mathematics educator and SAT instructor with more than eight years of experience working with students across different ages, abilities, and academic backgrounds.`
        }, 
        {
            paragraphId: 2, 
            content: `After years of tutoring, I wanted to build something that could go beyond simply giving students more questions. This platform combines my experience as an educator with data-driven technology to help students understand how they're performing and where they should focus next.`
        }
    ]

    const buttonClass = `
        flex flex-row items-center gap-2 w-72 mt-4
        bg-primary text-white px-6 py-2.5 rounded-full
        hover:bg-accent hover:scale-105 transition-all duration-300
    `

    return (
        <>
            <section className="relative w-screen left-1/2 right-1/2 mx-[-50vw] bg-[#F5F5FC] pt-16 pb-16 text-center mt-20">
                <div className="max-w-6xl mx-auto relative">
                    <div className="flex flex-row items-center">

                        <div className="flex-1">
                            Picture of me here
                        </div>

                        <div className="flex-1 space-y-2 flex items-center justify-center flex-col p-4">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-main text-center">
                                Why this platform?
                            </div>

                            <div className="text-lg font-semibold text-main text-center italic">
                                Built by an educator. Designed around students.
                            </div>

                            <div className="space-y-4 text-left">
                                {miniSynposis.map((item) => (
                                    <p key={item.paragraphId} className="text-base md:text-lg text-gray-700">
                                        {item.content}
                                    </p>
                                ))}
                            </div>

                            <Link
                                href="/about"
                                className={buttonClass}>
                                <CircleArrowLeft strokeWidth="2" size={40} />
                                <p className="text-xl font-semibold">
                                    Learn More About Me
                                </p>
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    )
}