"use client"

import useDemoButton from "@/hooks/useDemoButton"
import { subscriptionTiers, tutoringTiers} from "@/utils/marketing/pricing"
import {TierAction} from "@/types/payments"
import { useAuth} from "@clerk/nextjs"
import { purchaseProduct } from "@/services/api.payment"
import { useRouter, useSearchParams} from "next/navigation"
import { useEffect, useRef} from "react"


// ClassName
const buttonClass = (isPopular: boolean) => `
    rounded-lg border border-secondary p-2 font-semibold cursor-pointer mt-4
    hover:scale-105 transition-all 
    ${isPopular ? 'bg-primary/80 text-white':''}
`
const cardClass = (isPopular:boolean) => `
    relative rounded-lg border-2 px-4 py-6 flex flex-col gap-y-1
    ${isPopular ? 'border-primary ':'border-secondary'}
`

export default function Page() {

    const router = useRouter()
    const {isLoaded, isSignedIn} = useAuth()
    const searchParams = useSearchParams()
    const resumed = useRef(false)

    // console.log("isLoaded and isSignedIn => ", isLoaded, isSignedIn)

    useEffect(() => {
        const resume = searchParams.get("resume")
        console.log("resume => ", resume )
        if (!resume || !isLoaded || !isSignedIn || resumed.current) return

        resumed.current = true
        router.replace("/pricing")   // clear ?resume so a refresh doesn't start checkout again
        purchaseProduct(resume).catch(() => {
            resumed.current = false
            alert("Something went wrong starting checkout. Please try again.")
        })
    }, [isLoaded, isSignedIn, searchParams, router])

    const {handleClick} = useDemoButton()

    const handleTierClick = async (action: TierAction) => {
        switch (action.type) {
            case "demo": 
                return handleClick()
            case "checkout": {
                if (!isLoaded) return 
                if (!isSignedIn) {
                    const redirectURL = `/pricing?resume=${encodeURIComponent(action.product)}`
                    router.push(`/sign-up?redirect_url=${encodeURIComponent(redirectURL)}`)
                    return 
                }
                await purchaseProduct(action.product)
                return 
            }
        }
    }
    return (
        <>
            <div className="w-full pt-6 pb-20">
                <div className="max-w-6xl mx-auto px-8 sm:px-6 md:px-4 flex flex-col items-center ">

                    {/* Title and Subtitle */}
                    <div className=" w-full max-w-3xl flex flex-col items-center text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5B55E8]">
                            Your SAT. Your Timeline.
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-400 italic mb-2">
                            Whether your SAT is next month or next semester, there&apos;s a plan built for your timeline.
                        </p>
                    </div>

                    <hr className="w-full border-t border-secondary mt-4" />

                    {/* Subscriptions and Sessions */}
                    <div className="w-full mt-8 gap-6 ">

                        {/* Subscriptions */}
                        <div className="mb-4">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">Self-Paced SAT Prep</h3>
                            <p className="text-gray-500">Practice Reading and Math, identify weak spots, and track your progress.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                            {subscriptionTiers.map((tier) => (
                                <div key={tier.label} className={cardClass(tier.popular)}>

                                    {tier.popular && (
                                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                                            Our Recommmendation
                                        </span>
                                    )}
                                    <p className="text-2xl font-semibold ">{tier.label}</p>
                                    <p className="leading-tight text-muted">{tier.description}</p>

                                    <div className="flex flex-row gap-x-2 items-baseline mt-auto pt-4 ">
                                        <p className="text-4xl font-semibold text-primary">${tier.price}</p>
                                        <p className="text-muted ">{tier.length}</p>
                                    </div>
                                    <p className="border-b border-secondary py-2"/>

                                    <ul className="mt-4 flex-1 space-y-2 text-base">
                                        {tier.features.map(f => (
                                            <li key={f} className="flex flex-row gap-x-2">
                                                <p>✓</p>
                                                <p>{f}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={()=>handleTierClick(tier.action)}
                                        className={buttonClass(tier.popular)}
                                    >
                                        {tier.cta}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="border-b border-secondary my-12 "/>

                        {/* Sessions */}
                        <div className="mb-4">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">One on One SAT Tutoring</h3>
                            <p className="text-gray-500">Get personalized help from a tutor online.</p>
                        </div>
                        <div className="divide-y-2 divide-secondary rounded-lg border-2 border-secondary">
                            {tutoringTiers.map((tier) => (
                                <div
                                    key={tier.label}
                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                <div className="flex items-center gap-x-3">
                                    <tier.Icon className={`h-10 w-10 shrink-0 rounded-md bg-accent p-1 ${tier.iconClass}`}/>
                                    <div>
                                        <p className="text-2xl font-semibold">{tier.label}</p>
                                        <p className="text-lg text-gray-500">{tier.description}</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-semibold text-primary sm:text-right">${tier.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}