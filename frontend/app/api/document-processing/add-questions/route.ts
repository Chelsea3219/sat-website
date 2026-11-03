import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth';



export const POST = withAdmin(async (req, _ctx, {token}) =>  {

    try {
        const question = await req.json()

        if (!question)
            return NextResponse.json({error: "No form question"}, {status: 400})

        // Forward question to save in the bronze and silver layer
        const baseURL = process.env.FASTAPI_URL
        const response = await fetch(`${baseURL}/api/document-processing/add-questions`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
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
})