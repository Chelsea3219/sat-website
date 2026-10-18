"use client"

import { useState, Fragment} from "react";
import WavyBackground from "../ui/WavyBackground";
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Activity, TrendingUp, ArrowRight, ChevronLeft, ChevronRight} from "lucide-react";
import {slide} from '@/utils/animations'
import "@/css/animation.css"

const solution = [
    {title:"Practice", description:"Work through SAT Reading & Writing and Math questions.", Icon:Pencil}, 
    {title:"Analyze", description:"Review your performance to see your strengths and areas for improvement.", Icon:Activity}, 
    {title:"Improve", description:"Use targeted practice to focus on the skills that need the most attention.", Icon:TrendingUp},
]

export default function Solution() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const total = solution.length
    
    const wrap = (i: number) => (i + total) % total
    const go = (i: number, dir: number) => {
        setDirection(dir)
        setActiveIndex(wrap(i))
    }
    const prev = () => go(activeIndex - 1, -1)
    const next = () => go(activeIndex + 1, 1)

    const renderCard = (step: typeof solution[number]) => (
        <div className={cardClass}>
            <div className="flex flex-row items-center space-x-1">
                <step.Icon className="text-primary w-8 h-8"/>
                <p className="text-primary font-bold text-3xl">{step.title}</p>
            </div>
            <p className="pt-4 text-primary font-semibold">{step.description}</p>
        </div>
    )

    const cardClass = "w-full flex justify-center flex-col rounded-xl bg-white p-4 w-60 h-52 ring-8 ring-white ring-offset-6 ring-offset-[#8a7de8]"

    return (
            <section className="relative w-screen left-1/2 right-1/2 mx-[-50vw] pt-32 pb-32 text-center ">
                <WavyBackground/>

                <div className="relative z-10 max-w-4xl mx-auto flex items-center flex-col px-4 md:px-2 ">
                    
                    <div className="text-md sm:text-lg md:text-xl font-semibold rounded-full bg-green-100 text-green-600 px-4 py-2 border-2 border-green-600">
                        That&apos;s where we come in.
                    </div>

                    <div className="pt-6 pb-4 ">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white text-center">
                            Turn Practice into Progress
                        </p>
                        <p className="italic text-white font-semibold">
                            Our platform helps you UNDERSTAND your performance, FOCUS on what matter, {" "} and BUILD a smarter study plan.
                        </p>
                    </div>

                    {/* Tablet and up: cards in a row */}
                    <div className="hidden md:flex items-center justify-center gap-6 pt-12 w-full px-6">
                        {solution.map((step, index) => (
                            <Fragment key={step.title}>
                                {renderCard(step)}
                                {index < solution.length - 1 && (
                                    <ArrowRight
                                        className="arrow-flow w-12 h-12 lg:w-16 lg:h-16 text-white shrink-0"
                                        strokeWidth={3}
                                        style={{ animationDelay: `${index * 0.3}s` }}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {/* Phones: one card at a time, swipeable */}
                    <div className="md:hidden w-sm flex justify-center px-6 py-4 overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={slide}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.3}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -60) next()
                                    else if (info.offset.x > 60) prev()
                                }}
                                className="w-full flex justify-center cursor-grab active:cursor-grabbing"
                            >
                                {renderCard(solution[activeIndex])}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls: phones only */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={prev} aria-label="Previous feature" className="p-2 text-white">
                            <ChevronLeft className="w-6 h-6" strokeWidth={3}/>
                        </button>
                        <div className="flex gap-2">
                            {solution.map((step, i) => (
                                <button
                                    key={step.title}
                                    onClick={() => go(i, i > activeIndex ? 1 : -1)}
                                    aria-label={`Show feature ${i + 1}`}
                                    className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-primary/30'}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} aria-label="Next solution" className="p-2 text-white">
                            <ChevronRight className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </section>
        )
    }