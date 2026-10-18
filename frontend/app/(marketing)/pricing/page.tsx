"use client"

import useDemoButton from "@/hooks/useDemoButton"
import { tiers, TierAction} from "@/utils/marketing/pricing"
import { useRouter} from "next/navigation"
import { useAuth } from "@clerk/nextjs"

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
    const {userId, isSignedIn} = useAuth()
    console.log("isSignedIn", isSignedIn)
    console.log("userId", userId)

    const {handleClick} = useDemoButton()

    const handleTierClick = (action: TierAction) => {
        switch (action.type) {
            case "demo":
                return handleClick()
            case "checkout": {
            const checkoutURL = `/api/checkout?plan=${action.plan}`;
            return isSignedIn 
                ? router.push(checkoutURL)
                : router.push(`/sign-up?redirect_url=${encodeURIComponent(checkoutURL)}`)
        }
        }
    }

    return (
        <>
            <div className="w-full pt-6 pb-20">
                <div className="max-w-6xl mx-auto px-8 md:px-4 flex flex-col items-center ">

                    {/* Title and Subtitle */}
                    <div className=" w-full max-w-3xl flex flex-col items-center text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5B55E8]">
                            Pick the Plan That Fits Your Test Date
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-main italic mb-2">
                            Whether your SAT is next month or next semester, there&apos;s a plan built for your timeline.
                        </p>
                    </div>

                    {/* Title and Subtitle */}
                    <div className="w-full mt-8 gap-6">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {tiers.map((tier) => (
                                <div key={tier.title} className={cardClass(tier.popular)}>

                                    {tier.popular && (
                                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                                            Our Recommmendation
                                        </span>
                                    )}
                                    <p className="text-2xl font-semibold ">{tier.title}</p>
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
                    </div>
                </div>
            </div>
        </>
    )
}