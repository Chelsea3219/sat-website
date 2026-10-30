import { NextResponse } from 'next/server'
import {auth} from "@clerk/nextjs/server"


export async function GET(req: Request) {
    try {
        // Make sure that the user is authenticated and an admin 
        const {userId, sessionClaims, getToken} = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        
        const token = await getToken()
        if (!token) return NextResponse.json({error: "Missing authentication token"}, {status:401 })

        // Check to see that the visitor is admin
        if (sessionClaims?.metadata?.role !== "admin") {
            return NextResponse.json({ error: "This section is locked from students and parents." }, { status: 403 })
        }

        // Declare the question search parameters 
        const {searchParams} = new URL(req.url)
        const section = searchParams.get("section")
        const topic = searchParams.get("topic")
        const subtopic = searchParams.get("subtopic")
        const source = searchParams.get("source")

        // Forward request to the backend
        const params = new URLSearchParams()
        if (section) params.append("section", section)
        if (topic) params.append("topic", topic)
        if (subtopic) params.append("subtopic", subtopic)
        if (source) params.append("source", source)

        const response = await fetch(`${process.env.FASTAPI_URL}/api/document-processing/fetch-raw-questions?${params.toString()}`, {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`,}
    })

        if (!response.ok) return NextResponse.json({error: "Failed to fetch questions."}, {status: response.status})

        const data = await response.json()
        //console.log("data: ", data)
        return NextResponse.json(data)


    } catch (err) {
        console.error("Unable to fetch BronzeQuestions : ", err)
        return NextResponse.json({error: 'Cannot fetch questions from the bronze.raw_questions'}, {status: 500});
    }
}