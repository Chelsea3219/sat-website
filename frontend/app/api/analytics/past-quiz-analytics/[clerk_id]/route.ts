import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ clerk_id: string }> }
) {
    try {
        // Makes sure that the user is authenticated
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const {clerk_id} = await params

        if (!clerk_id) return NextResponse.json({ error: "Missing clerk_id" }, { status: 400 })

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const res = await fetch(`${process.env.FASTAPI_URL}/api/analytics/past-quiz-analytics/${clerk_id}/`, {
            method: 'GET'
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