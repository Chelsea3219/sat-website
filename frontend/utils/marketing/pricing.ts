import { CalendarClock } from "lucide-react"
import {IconSquareRoundedNumber3, IconSquareRoundedNumber5} from '@tabler/icons-react';
import { PricingProps } from "@/types/payments";


export const subscriptionTiers : PricingProps[] = [
    {
        label:"Start",
        length: null,
        price:"0",
        description:"Find out where you stand before you commit.", 
        features:["Diagnostic quiz set", "Practice Linear Functions", "Practice Transition Words", "Snapshot of your strengths and weak spots"],
        cta:"Try the Demo",
        action:{type: "demo"},
        popular: false
    }, 
    {
        label:"Step Foward",
        length:"a month",
        price:"49",
        description:"A focused brush-up for students whose test is just around the corner.", 
        features:["Unlimited Math & Reading questions", "Step-by-step answer explanations", "Progress Tracking across SAT topics", "Cancel Anytime"],
        cta:"Take the First Step",
        action: { type: "checkout", product: "monthly" },
        popular: false,
    }, 
    {
        label:"Move Foward",
        length:"for 3 months",
        price:"132",
        description:"One complete prep cycle, from your first practice set to test day.",
        features:["Historical progress charts and topic-level mastery trends", "Personalized study session", "Review of previously missed questions", "Diagostic retake and progress comparison"],
        cta:"Get Test Ready",
        action: { type: "checkout", product: "three_months" },
        popular: true
    }, 
    {
        label:"Leap Foward",
        length:"for 6 months",
        price:"235",
        description:"Room to prep, take the test, and come back stronger for a retake.",
        features:["Covers 2-3 test dates", "Long-term progress history", "Best value per month", "Diagostic retake and progress comparison"],
        cta:"Make the Leap",
        action: { type: "checkout", product: "six_months" },
        popular: false
    }
]


export const tutoringTiers = [
    {
        label:"Single Session", 
        description: "One private 60-minute online class",
        price: "65", 
        numSessions: "1", 
        Icon: CalendarClock, 
        iconClass: "bg-primary/30 text-primary"
    },
    {
        label:"Three Session bundle", 
        price: "180", 
        description: "Three private 60-minute class",
        numSessions: "3", 
        Icon: IconSquareRoundedNumber3, 
        iconClass: "bg-accent/30 text-accent"
    }, 
    {
        label:"Five Session bundle", 
        description: "Five private 60-minute class",
        price: "275", 
        numSessions: "5", 
        Icon: IconSquareRoundedNumber5,
        iconClass: "bg-primary/30 text-primary"
    },
]


const PLANS = ["monthly", "three_months", "six_months"] as const
export type PlanProps = (typeof PLANS)[number]   // "monthly" | "three_months" | "six_months"

export function isPlan(value: unknown): value is PlanProps {
    return typeof value === "string" && (PLANS as readonly string[]).includes(value)
}
