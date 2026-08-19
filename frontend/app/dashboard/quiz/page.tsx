import Image from "next/image";
import Link from "next/link"
//import Button from "../../../components/tab-window/helpers/button"


export default async function Page() {

    const buttonClass = `
        cursor-pointer w-40 bg-gradient-to-r from-primary to-primary/60 px-6 py-2 rounded text-white font-semibold 
        shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] 
        hover:bg-gradient-to-r hover:from-accent hover:to-accent/50
        focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow
    `

    return (
        <div className="flex justify-center w-full">
            <div className="w-full flex justify-center ">
                <div className="p-4 border-[3px] rounded-2xl border-primary max-w-5xl w-full mx-4">
                    <div className="flex flex-row gap-2">

                        {/* Right-side (reading versus math) */}
                        <div className="flex-1 flex-col flex items-center justify-center text-center gap-y-2">
                            <p className="text-3xl text-primary font-semibold"
                            >
                                Click below to launch your assessment
                            </p>

                            <p className="italic text-gray-600"
                            >
                                No stress, just a quick look at what you know!
                            </p>
                            <div className="flex flex-row gap-x-4 pt-6">
                                <Link href="/dashboard/quiz/reading" className={buttonClass}>Reading</Link>
                                <Link href="/dashboard/quiz/math" className={buttonClass}>Math</Link>
                            </div>
                        </div>

                        {/* Left-side (image) */}
                        <div className="hidden sm:flex flex-1 flex-col justify-center items-center min-w-0">
                            <Image
                                src="/dashboard/quiz-homepage-primary.svg"
                                alt="Registration Visual"
                                width={500} height={500}
                                className="w-full max-w-md h-auto"
                            />
                            <a href="https://storyset.com/education" className="text-xs flex justify-center text-gray-400">
                                Education illustrations by Storyset
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}