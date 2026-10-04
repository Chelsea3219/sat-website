import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
        const questions = await req.json()
        console.log("Raw questions being sent for upload", JSON.stringify(questions))

        if (!questions) return NextResponse.json({error: "No questions provided"}, {status: 400})

        // Forward Questions to save in the bronze.raw_questions dataset
        const baseURL = process.env.FASTAPI_URL
        if (!baseURL) throw new Error("FASTAPI URL is not set in environment variables")

        const response = await fetch(`${baseURL}/api/document-processing/bulk-upload-questions`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(questions)
        })

        const data = await response.json()

        if (!response.ok) {
            const text = await response.text()
            console.error("FastAPI error:", text)
            return NextResponse.json({error: text}, {status: response.status})
        }

        return NextResponse.json(data)

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({error: 'Upload and Extraction Failed'}, {status: 500});
    }
}