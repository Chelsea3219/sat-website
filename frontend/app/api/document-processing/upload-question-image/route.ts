import {NextResponse} from "next/server";

export async function POST(request: Request) {

    try {
        const formData = await request.formData()
        const image = formData.get("image") as File

        if (!image) return NextResponse.json({error: "No image provided."}, { status: 400 })

        // Forward image to backend to upload to Cloudinary
        const form = new FormData()
        // formData comes from the HTTP request. It's builtin in the questionAPIs before it's sent to the
        form.append('image', formData.get("image") as File)
        form.append('section', formData.get('section') as string)
        form.append('topic', formData.get('topic') as string)
        form.append('subtopic', formData.get('subtopic') as string[0])
        form.append('category', formData.get('category') as string)

        const baseURL = process.env.FASTAPI_URL
        const response = await fetch(`${baseURL}/api/document-processing/upload-question-image`, {
            method: 'POST',
            body: form
        })

        const data = await response.json()
        if (!response.ok) return NextResponse.json({error: data.detail}, { status: 400 })

        return NextResponse.json(data)
    } catch (error) {
        console.error("error : ", error )
        return NextResponse.json({error: "Cannot upload question image"}, { status: 500 })
    }
}
