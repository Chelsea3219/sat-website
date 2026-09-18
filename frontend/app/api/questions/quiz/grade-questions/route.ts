import { NextResponse, NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {

    try {
        // Makes sure that the user is authenticated
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Guard against an empty answer sheet 
        const answerSheet = await req.json()
        if (!answerSheet) return NextResponse.json({error: "No answer sheet provided."}, {status: 400})

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

        const res = await fetch(`${process.env.FASTAPI_URL}/api/questions/quiz/grade-questions`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(answerSheet)
        })

        const data = await res.json()

        if (!res.ok) return NextResponse.json({ error: data.detail || "Cannot grade questions." }, { status: res.status })
        
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: "Cannot grade questions." }, { status: 500 });
    }
}