export type TierAction =
    | { type: "demo" }
    | { type: "checkout"; plan: "monthly" | "quarterly" | "semiannual" }

type PricingProps = {
    title: string 
    length: string | null 
    price: number | string
    description: string
    features: string[]
    cta: string 
    action: TierAction
    popular: boolean

}
export const tiers : PricingProps[] = [
    {
        title:"Start",
        length: null,
        price:"0",
        description:"Find out where you stand before you commit.", 
        features:["Diagnostic quiz set", "Practice Linear Functions", "Practice Transition Words", "Snapshot of your strengths and weak spots"],
        cta:"Try the Demo",
        action:{type: "demo"},
        popular: false
    }, 
    {
        title:"Step Foward",
        length:"a month",
        price:"100",
        description:"A focused brush-up for students whose test is just around the corner.", 
        features:["Unlimited Math & Reading questions", "Step-by-step answer explanations", "Progress Tracking across SAT topics", "Cancel Anytime"],
        cta:"Take the First Step",
        action: { type: "checkout", plan: "monthly" },
        popular: false,
    }, 
    {
        title:"Move Foward",
        length:"for 3 months",
        price:"240",
        description:"One complete prep cycle, from your first practice set to test day.",
        features:["Historical progress charts and topic-level mastery trends", "Personalized study session", "Review of previously missed questions", "Diagostic retake and progress comparison"],
        cta:"Get Test Ready",
        action: { type: "checkout", plan: "quarterly" },
        popular: true
    }, 
    {
        title:"Leap Foward",
        length:"for 6 months",
        price:"420",
        description:"Room to prep, take the test, and come back stronger for a retake.",
        features:["Covers 2-3 test dates", "Long-term progress history", "Best value per month", "Diagostic retake and progress comparison"],
        cta:"Make the Leap",
        action: { type: "checkout", plan: "semiannual" },
        popular: false
    }
]