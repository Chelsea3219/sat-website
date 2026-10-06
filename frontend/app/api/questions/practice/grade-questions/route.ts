import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server"
import { isGuestAllowedSubtopic } from '@/utils/guest'

export async function POST(req: NextRequest) {

    try {
        // Makes sure that the user is authenticated
        const { userId, sessionClaims } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Guard against an empty answer sheet 
        const {answerSheet, subtopic, sessionId} = await req.json()

        // Guests can only practice the demo subtopics 
        if (sessionClaims?.metadata?.role === "guest" && !isGuestAllowedSubtopic(subtopic)) {
            return NextResponse.json({ error: "This subtopic is locked in the demo." }, { status: 403 })
        }

        if (!answerSheet || answerSheet.length===0) return NextResponse.json({error: "No practice answer sheet provided."}, {status: 400})
        if (!subtopic || !userId || !sessionId) return NextResponse.json({error: "No practice answer sheet provided."}, {status: 400})

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

        const res = await fetch(`${process.env.FASTAPI_URL}/api/questions/practice/${encodeURIComponent(subtopic)}/grade-questions/${userId}/${sessionId}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(answerSheet),
        })

        const data = await res.json()

        if (!res.ok) return NextResponse.json({ error: data.detail || "Cannot grade practice questions." }, { status: res.status })
        
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: "Cannot grade practice questions." }, { status: 500 });
    }
}