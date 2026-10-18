import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICES = {
    monthly:    { price: process.env.STRIPE_PRICE_MONTHLY!,    mode: "subscription" },
    quarterly:  { price: process.env.STRIPE_PRICE_QUARTERLY!,  mode: "payment" },
    semiannual: { price: process.env.STRIPE_PRICE_SEMIANNUAL!, mode: "payment" },
} as const

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url))

    const plan = new URL(req.url).searchParams.get("plan") as keyof typeof PRICES
    const config = PRICES[plan]
    if (!config) return NextResponse.redirect(new URL("/pricing", req.url))

    const user = await currentUser()
    const origin = new URL(req.url).origin

    const existing = await stripe.customers.search({ query: `metadata['clerkUserId']:'${userId}'` })
    const customer = existing.data[0] ?? await stripe.customers.create({
        email: user?.primaryEmailAddress?.emailAddress,
        metadata: { clerkUserId: userId },
    })

    const session = await stripe.checkout.sessions.create({
        mode: config.mode,
        customer: customer.id, 
        line_items: [{ price: config.price, quantity: 1 }],
        client_reference_id: userId,             // links the payment to the Clerk user
        metadata: { clerkUserId: userId, plan },
        success_url: `${origin}/register?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing`,
    })

    return NextResponse.redirect(session.url!, 303)
}