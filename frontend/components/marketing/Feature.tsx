"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {slide} from '@/utils/animations'

const features = [
    { title: "Personalized Practice", description: "Practice is designed around your performance and areas for improvement." },
    { title: "Progress Tracking", description: "See your accuracy, mastery, and progress across SAT topics." },
    { title: "SAT Reading & Writing", description: "Master vocabulary, grammar rules, and text analysis tested on the digital exam." },
    { title: "SAT Math", description: "Strengthen your mathematical skills through targeted practice." },
]

export default function Feature() {
    const cardClass = "w-full flex justify-center flex-col max-w-xs sm:max-w-none min-h-52 p-5 bg-white text-center border-4 border-[#f59e0b] rounded-xl shadow-[12px_12px_0_#f59e0b] sm:shadow-[20px_20px_0_#f59e0b]"
    const titleClass = "text-[#1B1F38] font-bold text-2xl mb-1 leading-tight"
    const contentClass = "text-main font-normal leading-relaxed"

    const [activeIndex, setActiveIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const total = features.length

    const wrap = (i: number) => (i + total) % total
    const go = (i: number, dir: number) => {
        setDirection(dir)
        setActiveIndex(wrap(i))
    }
    const prev = () => go(activeIndex - 1, -1)
    const next = () => go(activeIndex + 1, 1)

    const renderCard = (feature: typeof features[number]) => (
        <div className={cardClass}>
            <p className={titleClass}>{feature.title}</p>
            <p className={contentClass}>{feature.description}</p>
        </div>
    )

    return (
        <section className="w-full max-w-7xl mx-auto text-center">
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-accent shadow-accent">
                    What Do We Offer?
                </h2>

                {/* Phones: one card at a time, swipeable */}
                <div className="sm:hidden w-full flex justify-center pl-4 pr-7 pb-2 overflow-hidden">
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
                            {renderCard(features[activeIndex])}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Tablet and up: all cards */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:px-8 pb-4 w-full">
                    {features.map(feature => (
                        <div key={feature.title}>{renderCard(feature)}</div>
                    ))}
                </div>

                {/* Controls: phones only */}
                <div className="sm:hidden flex items-center gap-4">
                    <button onClick={prev} aria-label="Previous feature" className="p-2 text-accent">
                        <ChevronLeft className="w-6 h-6" strokeWidth={3}/>
                    </button>
                    <div className="flex gap-2">
                        {features.map((feature, i) => (
                            <button
                                key={feature.title}
                                onClick={() => go(i, i > activeIndex ? 1 : -1)}
                                aria-label={`Show feature ${i + 1}`}
                                className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-accent' : 'w-2 bg-accent/30'}`}
                            />
                        ))}
                    </div>
                    <button onClick={next} aria-label="Next feature" className="p-2 text-accent">
                        <ChevronRight className="w-6 h-6" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </section>
    )
}