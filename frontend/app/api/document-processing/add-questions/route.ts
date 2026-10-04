
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
    // Checks to make sure that the user is an adminstrator
    //const {orgRole} = await auth();
    //if (orgRole !== "org:admin") return NextResponse.json( {error: 'Not Authorized'}, {status: 401})


    try {
        const question = await req.json()

        if (!question)
            return NextResponse.json({error: "No form question"}, {status: 400})

        // Forward question to save in the bronze and silver layer
        const baseURL = process.env.FASTAPI_URL
        if (!baseURL) throw new Error("FASTAPI URL is not set in environment variables")
        const response = await fetch(`${baseURL}/api/document-processing/add-questions`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(question)
        })

        const data = await response.json()
        console.error("FastAPI response: ", JSON.stringify(data, null, 2))

        if (!response.ok) return NextResponse.json(data, {status: response.status})

        return NextResponse.json(data)

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({error: 'Bronze and Silver Upload Failed'}, {status: 500});
    }
}