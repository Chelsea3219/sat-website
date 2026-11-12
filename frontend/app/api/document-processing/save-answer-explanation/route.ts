import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth';


export const POST = withAdmin(async (req, _ctx, {token}) =>  {

    try {
        const explanation = await req.json()

        if (!explanation) return NextResponse.json({error: "No explanation provided"}, {status: 400})

        // Forward Explanation to save in the silver hints_answer_explanations dataset
        const baseURL = process.env.FASTAPI_URL
        const response = await fetch(`${baseURL}/api/document-processing/save-answer-explanation`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
            body: JSON.stringify(explanation)
        })

        const data = await response.json()
        console.error("FastAPI response:", JSON.stringify(data, null, 2))

        if (!response.ok) return NextResponse.json({error: data.error}, {status: response.status})

        return NextResponse.json(data)

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({error: 'Hints Answer Explanation Update Failed'}, {status: 500});
    }
})

