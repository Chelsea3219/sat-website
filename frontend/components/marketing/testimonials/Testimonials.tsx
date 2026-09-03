import React, {useState} from 'react'
import {motion} from 'framer-motion'
import {Quote} from 'lucide-react'
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


export default function Testimonials({testimonials}: CardProps) {
  
    const [activeIndex, setActiveIndex] = useState(1)
    const total = testimonials.length


    // Helper function to get items wrapping around the array bounds
    const getCardData = (position: 'left' | 'middle' | 'right'): Testimonial => {
        if (position === 'left') {
            const index = (activeIndex - 1 + total) % total 
            return testimonials[index]
        }
        if (position === 'right') {
            const index = (activeIndex + 1) % total 
            return testimonials[index]
        }
        return testimonials[activeIndex]
    }

    // Build a display array mappted to their virtual layout positions 
    const displayCards = [
        {...getCardData('left'), position: 'left', targetIndex: (activeIndex-1 + total)%total}, 
        {...getCardData('middle'), position: 'middle', targetIndex: activeIndex}, 
        {...getCardData('right'), position: 'right', targetIndex: (activeIndex+1)%total}
    ]

    // Swaps the middle cad with the selected Card
    const handleCardClick = (targetIndex: number, position: string) => {
        if (position === "middle") return
        setActiveIndex(targetIndex)
    }

    return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="flex -space-x-10 items-center justify-center w-full max-w-5xl">
        {displayCards.map((card) => {
          const isMiddle = card.position === 'middle';

          return (
            <motion.div
              key={card.id} // Changing key based on testimonial ID creates smooth fade transitions for content
              layoutId={`card-${card.id}`}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              onClick={() => handleCardClick(card.targetIndex, card.position)}
              className={`
                rounded-2xl shadow-xl p-8 text-white cursor-pointer select-none border-4 border-primary
                transition-all duration-300 flex flex-col justify-between
                ${isMiddle 
                  ? 'w-150 h-90 scale-100 z-20 shadow-2xl opacity-100 bg-white' 
                  : 'w-50 h-90 scale-75 z-15 bg-primary/60 hover:bg-accent/80 hover:border-accent'
                }
              `}
            >
              {isMiddle ? (
                // Full Testimonial Content for the Middle Card
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col h-full justify-between"
                >
                  <div className='flex flex-col items-center justify-center'>
                    <Quote className="w-10 h-10 self-end text-secondary"/>
                    <p className="text-base italic leading-relaxed text-main font-semibold mb-2">
                        {card.text}
                    </p>
                    <StarRating rating = {card.rating} maxStars={5}/>
                    <Quote className="w-10 h-10 text-secondary self-start scale-x-[-1]"/>
                    
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-primary text-base font-semibold'>{card.name}</p>
                        <p className='text-slate-400 text-sm'>{card.date}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Clean Minimal Placeholder for Side Cards
                <div className="relative flex items-center justify-center h-full w-full overflow-hidden rounded-2xl">
                    {/* Centered icon badge */}
                    <div className="relative z-20 flex items-center justify-center">
                        <div>
                          <p className='font-semibold mb-2'>
                            {card.text.length > 100
                              ? `${card.text.slice(0,100)}...`
                              : card.text}
                          </p>
                          <p className='font-semibold'>~ {card.name}</p>
                        </div>
                    </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}