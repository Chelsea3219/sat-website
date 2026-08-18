export default function Feature() {

    const cardClass = "w-60 h-52 p-5 border-4 border-[#f59e0b] rounded-xl shadow-[20px_20px_0_#f59e0b]"
    const titleClass = "text-[#1B1F38] font-bold text-2xl mb-1 leading-tight"
    const contentClass = "text-main font-normal leading-relaxed"

    return (
        <>

            <div className="relative w-screen left-1/2 right-1/2 mx-[-50vw] overflow-hidden py-6 md:py-8">
                <section className="max-w-7xl mx-auto text-center relative">
                    <div className="space-y-2 flex flex-col items-center justify-center">
    
                        <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#6366F1] text-center mb-5">
                            What Do We Offer?
                        </div>

                        <div className="flex flex-row space-x-10">
                            <div className={cardClass}>
                                <p className={titleClass}>Personalized Practice</p>
                                <p className={contentClass}>Practice is designed around your performance and areas for improvement.</p>
                            </div>

                            <div className={cardClass}>
                                <p className={titleClass}>Progress Tracking</p>
                                <p className={contentClass}>See your accuracy, mastery, and progress across SAT topics.</p>
                            </div>

                            <div className={cardClass}>
                                <p className={titleClass}>SAT Reading & Writing</p>
                                <p className={contentClass}>Master vocabulary, grammar rules, and text analysis tested on the digital exam.</p>
                            </div>

                            <div className={cardClass}>
                                <p className={titleClass}>SAT<br/>Math</p>
                                <p className={contentClass}>Strengthen your mathematical skills through targeted practice.</p>
                            </div>

                        </div>
    
                    </div>
                </section>
            </div>
        </>
    )
}