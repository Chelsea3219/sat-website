import Image from "next/image"


export default function Problem() {

    return (
        <div className="relative bg-[#FFFCF5] w-screen left-1/2 right-1/2 mx-[-50vw] overflow-hidden py-6 md:py-8">. {/* bg-[#F5F5FC] is a light gray color */}
            <section className="max-w-7xl mx-auto text-center relative">
                <div className="space-y-2 flex flex-col items-center px-4 md:px-2 ">
    
                    <p className="text-base sm:text-lg md:text-xl font-semibold w-52 md:w-96 rounded-full bg-red-200 text-red-600 p-2">
                        The Problem Every Student Faces
                    </p>

                    <div className="pt-4">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-main text-center">
                            Not all practice is equally useful.
                        </p>
                        <p className="italic text-sm">A student can answer hundreds of SAT questions and still not know</p>
                        <p className="font-semibold uppercase">what they actually need to improve. </p>
                    </div>


                    {/* Image */}
                    <div className="flex justify-center ">
                        <Image
                            src = "/marketing/stressed-student.png"
                            alt="Hero Image"
                            width={400} height={400}
                            className="w-md md:w-xl h-auto flex items-center"
                        />
                    </div>

                    <p className="text-base sm:text-lg md:text-xl font-semibold w-52 md:w-96 rounded-full bg-orange-100 text-orange-600 p-2">
                        So, what should you practice next?
                    </p>

                </div>
            </section>
        </div>
    )
}