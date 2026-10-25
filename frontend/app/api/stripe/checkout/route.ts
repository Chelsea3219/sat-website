import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest} from "next/server"


export async function POST(request: NextRequest) {
    
    try {
        // Verify that the user is sign in
        const {userId, getToken} = await auth()
        if (!userId) return NextResponse.json({ detai: "Not signed in" }, { status: 401 })

        const token = await getToken()
        if (!token) return NextResponse.json({ status:401, detail: "Unable to authenticate your session." })
        
        const {product} = await request.json()

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const response = await fetch(`${process.env.FASTAPI_URL}/api/stripe/checkout`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                ...(
                    token ? {Authorization: `Bearer ${token}`} : {})
            },
            body: JSON.stringify({product}), 
            cache: "no-store"
        })
        
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("FastAPI Checkout error:", {
                status: response.status,
                details: data?.detail ?? data?.error ?? data,
            });
            return NextResponse.json({detail: data.detail ?? "Checkout could not be created."}, {status: response.status});
        }

        return NextResponse.json(data, {status: response.status})

    } catch (error) {
        console.error("Error creating the checkout session: ", error)
        return NextResponse.json( {error: "Failed to create the checkout session."}, {status: 500})
    }
}