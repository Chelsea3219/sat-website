
import { synposis } from "@/utils/marketing/about-synposis"
import Image from "next/image"
import {renderFormattedText} from "@/utils/renderFormattedText"
export default function Page() {

    return (
        <>
            <div className=" w-full">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row space-x-4">

                    {/* About Me */}
                    <div className="flex-1 space-y-2">
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5B55E8] mb-2 ">
                            About Me
                        </h1>
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5B55E8] mb-2">Helping Students Learn With Confidence</p>

                        <div className="space-y-4">
                            {(synposis).map((paragraph) => (
                                <div key={paragraph.id}>
                                    {renderFormattedText(paragraph.message)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Picture*/}
                    <div className="flex-1 space-y-2">
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