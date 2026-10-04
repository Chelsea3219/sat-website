import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const file = formData.get('file') as File;

    // Checks the file
    if (!file) return NextResponse.json({error: "No file provided."}, {status: 400})

    // Validate the file size
    const maxSize = 6 * 1024 * 1024
    if (file.size > maxSize) return NextResponse.json({error: "File is too large."}, {status: 400})

    try {
        const fileForm = new FormData()
        fileForm.append('file', file)
        fileForm.append('section', formData.get('section') as string)
        fileForm.append('topic', formData.get('topic') as string)
        fileForm.append('subtopic', formData.get('subtopic') as string)
        fileForm.append('source', formData.get('source') as string)

        // Forward Form to backend for preprocessing, extraction, and organization
        const baseURL = process.env.FASTAPI_URL
        if (!baseURL) throw new Error("FASTAPI URL is not set in environment variables")
        const response = await fetch(`${baseURL}/api/document-processing/extract-questions`, {
            method: 'POST',
            body: fileForm
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
}
