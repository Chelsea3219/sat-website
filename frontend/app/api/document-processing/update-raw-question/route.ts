// responsible for updating the raw questions in the bronze table and inserting them in the silver table

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
        const questions = await req.json()

        if (!questions) return NextResponse.json({error: "No questions provided"}, {status: 400})

        // Forward Questions to save in the bronze.raw_questions dataset
        const baseURL = process.env.FASTAPI_URL
        if (!baseURL) throw new Error("FASTAPI URL is not set in environment variables")
        const response = await fetch(`${baseURL}/api/document-processing/update-raw-question`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(questions)
        })

        const data = await response.json()
        console.error("FastAPI response:", JSON.stringify(data, null, 2))

        if (!response.ok) return NextResponse.json({error: data.error}, {status: response.status})

        return NextResponse.json(data)

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({error: 'Bronze and Silver Upload Failed'}, {status: 500});
    }
}