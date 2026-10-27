"use client"

import { Suspense} from "react"
import { PricingClient } from "@/components/marketing/PricingClient"


export default function Page() {

    return (
        <Suspense fallback={null}>
            <PricingClient/>
        </Suspense>
    )
}