import { NextResponse } from "next/server";
import { withAdmin } from '@/lib/auth';


export const DELETE = withAdmin<{ question_id: string }>(async (_req, { params }, { token }) => {
  try {

    // Extract the question_id from the request parameters
    const { question_id } = await params;
    const response = await fetch(`${process.env.FASTAPI_URL}/api/document-processing/delete-questions/${encodeURIComponent(question_id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    
    if (!response.ok) {
        const text = await response.text()
        console.error("API error:", response.status, text)
        throw new Error("Failed to delete question")
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status }) 
    
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json( {error: 'Failed to delete question'}, {status: 500})
  }
})


