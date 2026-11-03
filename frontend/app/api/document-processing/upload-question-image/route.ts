import {NextResponse} from "next/server";
import { withAdmin } from '@/lib/auth';




export const POST = withAdmin(async (request, _ctx, {token}) =>  {

    try {
        const formData = await request.formData()

        const image = formData.get("image")
        if (!(image instanceof File) || image.size === 0) {
            return NextResponse.json({ error: "No image provided." }, { status: 400 })
        }

        const baseURL = process.env.FASTAPI_URL
        const response = await fetch(`${baseURL}/api/document-processing/upload-question-image`, {
            method: 'POST',
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`, },
            body: formData, 
            cache: "no-store", 
        })

        const data = await response.json()
        if (!response.ok) return NextResponse.json({error: data.detail}, { status: 400 })

        return NextResponse.json(data)
    } catch (error) {
        console.error("error : ", error )
        return NextResponse.json({error: "Cannot upload question image"}, { status: 500 })
    }
})
