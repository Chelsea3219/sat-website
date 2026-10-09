import { NextRequest, NextResponse } from "next/server";
import {auth} from "@clerk/nextjs/server";

export async function DELETE( 
    request: NextRequest,
    { params }: {params: Promise<{ question_id: string }> }
) {
  try {

    // Makes sure that the user is an adminstrator
    const {sessionClaims} = await auth();
    console.log("Session Claims:", sessionClaims?.metadata?.role);
    if (sessionClaims?.metadata?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized to delete question" }, { status: 403 })
    }

    // Extract the question_id from the request parameters
    const { question_id } = await params;
    const response = await fetch(`${process.env.FASTAPI_URL}/api/document-processing/delete-questions/${question_id}`, {
      method: 'DELETE',
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
}
