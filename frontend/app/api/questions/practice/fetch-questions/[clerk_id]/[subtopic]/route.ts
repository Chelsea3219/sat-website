import { NextResponse, NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server"
import { PracticeAnswerSheet} from "@/types/questions"

export async function POST(
    req: NextRequest,
    {params}: {params: Promise<{clerk_id:string, subtopic: string, sessionAnswers: PracticeAnswerSheet[]}> }
) {

    try {
        // Makes sure that the user is authenticated
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const {clerk_id, subtopic, sessionAnswers} = await params
        if (!clerk_id || !subtopic) return NextResponse.json({ error: "Missing clerk_id" }, { status: 400 })

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const res = await fetch(`${process.env.FASTAPI_URL}/api/questions/practice/fetch-questions/${clerk_id}/${subtopic}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionAnswers)
        })

        const data = await res.json()
        console.log("incoming practice questions ==>> ", data)

        if (!res.ok) {
            return NextResponse.json({ error: data.detail || "Cannot fetch practice questions" }, { status: res.status })
        }
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: "Cannot fetch practice questions" }, { status: 500 });
    }
}