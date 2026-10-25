// IDEA: Browser --> Next.js API route --> FastAPI
// Now the server only talks to the next,js server, meaning that the FASTAPI URL, port and server address are never visible to the user
// next.js route now checks the Clerk token server side token before forwarding anything to the FastAPI

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
    // Makes sure that the user is authenticated
    const { userId, getToken} = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const token = await getToken() 
    if (!token) return NextResponse.json({status:401, detail:"Unable to authenticate your session"})
    
        // ADD THE CLERK ID, STRIPE_ID, SUBSCRIPTION 
    try {
        const body = await req.json()
        console.log("payload from the frontend", body)

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const res = await fetch(`${process.env.FASTAPI_URL}/api/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                ...(
                    token ? {Authorization: `Bearer ${token}`} : {})
            },
            body: JSON.stringify(body),
            cache: "no-store"
        })

        const data = await res.json()

        console.log("FastAPI registration status:", res.status);
        console.log("FastAPI registration response:", data);

        if (!res.ok) {
            return NextResponse.json({ error: data.detail || "Registration failed" }, { status: res.status })
        }
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: 'Registration Failed' }, { status: 500 });
    }
}