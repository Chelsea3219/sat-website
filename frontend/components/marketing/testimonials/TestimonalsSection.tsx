"use client"

import Testimonials from "./Testimonials";
import { studentTestimonials } from "./studentTestimonials";
import {SignUpButton} from "@clerk/nextjs";



export default function TestimonialsSection() {
    const buttonClass = `
        flex items-center justify-center gap-2 w-72 mt-4
        bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xl
        hover:bg-accent hover:scale-110 transition-all duration-300
    `
    
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold text-[#5B55E8] mb-2">
                See What Others Are Saying
            </h1>
            <Testimonials testimonials={studentTestimonials} />

            <SignUpButton mode="redirect">
                <button className={buttonClass}>
                    Start Your SAT Journey
                </button>
            </SignUpButton>
        </div>
    );
}