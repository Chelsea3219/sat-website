
import Hero from "@/components/marketing/Hero"
import Problem from "@/components/marketing/Problem"
import Solution from "@/components/marketing/Solution"
import Feature from "@/components/marketing/Feature"
import WhyMe from "@/components/marketing/WhyMe"
import ProductDemo from "@/components/marketing/ProductDemo"
import TestimonialsSection from "@/components/marketing/testimonials/TestimonalsSection"
import SATSubjects from "@/components/marketing/SATSubjects"


export default function Page() {

    return(
        <>
            <div>
                <Hero/>
                <Problem/>
                <Solution/>
                <Feature/>
                <WhyMe/>
                <ProductDemo/>
                <TestimonialsSection/>
                <SATSubjects/>
            </div>
        </>
    )
}