import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth';


const MAX_SIZE = 6 * 1024 * 1024
const REQUIRED = ["section", "topic", "subtopic", "source"] as const


export const POST = withAdmin(async (req, _ctx, {token}) =>  {
    const formData = await req.formData()
    const file = formData.get('file') as File;

    // Checks the file
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({error: "No file provided."}, {status: 400})

    // Validate the file size
    if (file.size > MAX_SIZE) return NextResponse.json({error: "File is too large."}, {status: 400})

    const missing = REQUIRED.filter((key) => !formData.get(key))
    if (missing.length) {
        return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 })
    }
    try {

        // Forward Form to backend for preprocessing, extraction, and organization
        const baseURL = process.env.FASTAPI_URL
        const response = await fetch(`${baseURL}/api/document-processing/extract-questions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData, 
            cache: "no-store", 
        })

        let data
        try {
            data = await response.json()
            //console.log('FastAPI response: ', data)
        } catch (error) {
            console.error("Invalid response from backend", error)
            return NextResponse.json({error: "Invalid response from backend"}, {status: 500})
        }

        if (!response.ok) return NextResponse.json({error: data.error || "Processing failed"}, {status: response.status})

        return NextResponse.json(data)

    } catch (err) {
        console.error("error: ", err)
        return NextResponse.json({error: 'Upload and Extraction Failed'}, {status: 500});
    }
})
