
import { synposis } from "@/utils/marketing/about-synposis"
import Image from "next/image"
import {renderFormattedText} from "@/utils/renderFormattedText"
export default function Page() {

    return (
        <>
            <div className="w-full pt-4 pb-8">
                <div className="max-w-5xl mx-auto px-8 md:px-4 flex flex-col md:flex-row space-x-4">

                    {/* About Me */}
                    <div className="flex-1">
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5B55E8] ">
                            About Me
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#5B55E8] mb-2">Helping Students Learn With Confidence</p>

                        <div className="space-y-4">
                            {(synposis).map((paragraph) => (
                                <div key={paragraph.id}>
                                    {renderFormattedText(paragraph.message)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Picture*/}
                    <div className="flex-1 px-10 md:px-4 flex items-center md:block ">
                        <Image
                            src="/marketing/profile-pic.png"
                            alt="About Me Visual"
                            width={1500} height={1500}
                            className="w-full h-auto mt-4 object-contain" 
                        />
                    </div>
                </div>
            </div>
        </>
    )
}