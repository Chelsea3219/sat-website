import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth';
import { ALLOWED_SEARCH_PARAMETERS } from '@/utils/admin/search';



export const GET = withAdmin(async (req, _ctx, {token}) =>  {
    try {

        // Forward request to the backend
        const params = new URLSearchParams(
            [...new URL(req.url).searchParams].filter(([key, value]) => ALLOWED_SEARCH_PARAMETERS.has(key) && value.trim())
        )

        const response = await fetch(`${process.env.FASTAPI_URL}/api/document-processing/search-questions?${params.toString()}`, {
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
})