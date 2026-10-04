import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url)
        const section = searchParams.get("section")
        const topic = searchParams.get("topic")
        const subtopic = searchParams.get("subtopic")

        // Forward request to the backend
        const params = new URLSearchParams()
        if (section) params.append("section", section)
        if (topic) params.append("topic", topic)
        if (subtopic) params.append("subtopic", subtopic)

        const response = await fetch(`${process.env.FASTAPI_URL}/api/document-processing/fetch-raw-questions?${params.toString()}`, {
        method: 'GET'
    })
        if (!response.ok) return NextResponse.json({error: "Failed to fetch questions."}, {status: response.status})
        //console.log("response: ", response)

        const data = await response.json()
        //console.log("data: ", data)
        return NextResponse.json(data)


    } catch (err) {
        console.error("Unable to fetch BronzeQuestions : ", err)
        return NextResponse.json({error: 'Cannot fetch questions from the bronze.raw_questions'}, {status: 500});
    }
}