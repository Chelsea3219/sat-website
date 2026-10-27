import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
    try {
        // Makes sure that the user is authenticated
        const { userId, getToken} = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = await getToken()
        if (!token) return NextResponse.json({error: "Missing authentication token"}, {status:401 })

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const res = await fetch(`${process.env.FASTAPI_URL}/api/analytics/past-quiz-analytics`, {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        })

        const text = await res.text()
        let data
        try {
            data = JSON.parse(text)
        } catch {
            console.error('Non-JSON response from FastAPI:', res.status, text)
            return NextResponse.json({ error: "Invalid response from backend" }, { status: 502 })
        }

        if (!res.ok) {
            return NextResponse.json({ error: data.detail || "Cannot fetch past quizzes." }, { status: res.status })
        }
        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: "Cannot fetch past quizzes." }, { status: 500 });
    }
}