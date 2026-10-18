import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import StarRating from '../../ui/StarRating'

type Testimonial = {
    id: number
    text: string
    rating: number
    date: string
    name: string
}

type CardProps = {
    testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: CardProps) {
    const [activeIndex, setActiveIndex] = useState(1)
    const total = testimonials.length

    const wrap = (i: number) => (i + total) % total
    const prev = () => setActiveIndex(i => wrap(i - 1))
    const next = () => setActiveIndex(i => wrap(i + 1))

    if (total === 0) return null

    // With fewer than 3 testimonials, side cards would repeat the same id (duplicate keys/layoutIds)
    const positions = total >= 3 ? (['left', 'middle', 'right'] as const) : (['middle'] as const)

    const displayCards = positions.map(position => {
        const targetIndex =
            position === 'left' ? wrap(activeIndex - 1)
            : position === 'right' ? wrap(activeIndex + 1)
            : activeIndex
        return { ...testimonials[targetIndex], position, targetIndex }
    })

    return (
        <section className="w-full max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center gap-4 py-2">
                <div className="flex sm:-space-x-6 md:-space-x-10 items-center justify-center w-full">
                    {displayCards.map(card => {
                        const isMiddle = card.position === 'middle'

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                                onClick={() => !isMiddle && setActiveIndex(card.targetIndex)}
                                // Swipe left/right on the middle card (mainly for phones)
                                drag={isMiddle ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.3}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -60) next()
                                    else if (info.offset.x > 60) prev()
                                }}
                                className={`
                                    rounded-2xl shadow-xl text-white select-none border-4 border-primary
                                    transition-colors duration-300 flex flex-col justify-between
                                    ${isMiddle
                                        ? 'w-full sm:flex-1 max-w-150 min-h-80 sm:min-h-120 p-5 sm:p-8 z-20 shadow-2xl bg-white cursor-grab active:cursor-grabbing'
                                        : 'hidden sm:flex shrink-0 w-32 md:w-50 h-72 md:h-120 p-4 md:p-8 scale-75 z-10 cursor-pointer bg-primary/60 hover:bg-accent/80 hover:border-accent'
                                    }
                                `}
                            >
                                {isMiddle ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex flex-col h-full items-center justify-between"
                                    >
                                        <Quote className="w-8 h-8 sm:w-10 sm:h-10 self-end text-secondary" />
                                        <p className="text-lg italic leading-relaxed text-main font-semibold mb-2 text-center">
                                            {card.text}
                                        </p>
                                        <StarRating rating={card.rating} maxStars={5} />
                                        <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-secondary self-start scale-x-[-1]" />
                                        <div className="flex flex-col items-center">
                                            <p className="text-primary text-base font-semibold">{card.name}</p>
                                            <p className="text-slate-400 text-sm">{card.date}</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col justify-center h-full w-full overflow-hidden">
                                        <p className="font-semibold mb-2 line-clamp-6">
                                            {card.text}
                                        </p>
                                        <p className="font-semibold text-xs md:text-base">~ {card.name}</p>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Controls: arrows on phones, dots everywhere */}
                <div className="flex items-center gap-4">
                    <button onClick={prev} aria-label="Previous testimonial" className="sm:hidden p-2 text-primary">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex gap-2">
                        {testimonials.map((t, i) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveIndex(i)}
                                aria-label={`Show testimonial ${i + 1}`}
                                className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-primary/30'}`}
                            />
                        ))}
                    </div>
                    <button onClick={next} aria-label="Next testimonial" className="sm:hidden p-2 text-primary">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    )
}