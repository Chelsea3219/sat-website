export type Product = "monthly" | "three_months" | "six_months" | "single_session" | "three_sessions" | "five_sessions"

export type Subscription = {
    clerk_id: string 
    stripe_id: string 
    stripe_subscription_id: string
    stripe_price_id: string 
    plan: string
    status: string 
    current_plan_end: string 
    created_at: string 
    updated_at: string 

}

export type TierAction =
    | { type: "demo" }
    | { type: "checkout"; product: Product  }

export type PricingProps = {
    label: string 
    length: string | null 
    price: number | string
    description: string
    features: string[]
    cta: string 
    action: TierAction
    popular: boolean

}