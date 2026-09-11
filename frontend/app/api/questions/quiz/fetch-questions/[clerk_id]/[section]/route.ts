import { NextResponse, NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server"

export async function GET(
    req: NextRequest,
    {params}: {params: Promise<{clerk_id:string, section: string}> }
) {

    try {
        // Makes sure that the user is authenticated
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const {clerk_id, section} = await params
        if (!clerk_id || !section) return NextResponse.json({ error: "Missing clerk_id" }, { status: 400 })

        // Checks to make sure that the frontend is connected to the backend
        if (!process.env.FASTAPI_URL) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const res = await fetch(`${process.env.FASTAPI_URL}/api/questions/quiz/fetch-questions/${clerk_id}/${section}`, {
            method: 'GET'
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json({ error: data.detail || "Cannot fetch quiz questions" }, { status: res.status })
        }
        return NextResponse.json(data, { status: res.status })

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({ error: "Cannot fetch quiz questions" }, { status: 500 });
    }
}