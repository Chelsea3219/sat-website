import type {IncomingSilverQuestions, BaseBronzeQuestions, QuestionSearchParameters} from "@/types/question-processing";


// Calls the APIs to preprocess, extract, and organize the questions from PDFs and workbooks
export async function extractQuestions(forwardForm: FormData) {
    const response = await fetch('/api/document-processing/extract-questions', {
        method: 'POST',
        body: forwardForm
    })
    const data = await response.json()
    return data
}


// Calls the APIs to bulk upload the questions to the bronze.raw_questions dataset
export async function bulkUploadQuestions(questions: BaseBronzeQuestions[]){
    const response = await fetch('/api/document-processing/bulk-upload-questions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(questions)
    })
    const data = await response.json()
    return data
}


// Calls the APIs to fetch questions from the bronze.raw_questions table
export async function fetchRawQuestions(info: QuestionSearchParameters){
    const params = new URLSearchParams()
    if (info.section) params.append("section", info.section)
    if (info.topic) params.append("topic", info.topic)
    if (info.subtopic) params.append("subtopic", info.subtopic)

    const response = await fetch(`/api/document-processing/fetch-raw-questions?${params.toString()}`, {
        method: 'GET'
    })
    const data = await response.json()
    return data
}


// Calls the APIs to update questions in the bronze.raw_questions and insert into the silver.clean_questions
export async function updateRawQuestions(question: IncomingSilverQuestions[]){
    const response = await fetch('/api/document-processing/update-raw-question', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(question)
    })

    if (!response.ok) {
        const error = await response.json()
        console.error("422 Detail:", JSON.stringify(error, null, 2))
        throw new Error(error.detail || "Failed to update question")
    }
    const data = await response.json()
    return data
}


// Calls the APIs to send the image from the frontend to backend
export async function uploadQuestionImage(image: File, category:string, form:IncomingSilverQuestions) {
    // Build the form to send to backend
    const imageForm = new FormData()
    imageForm.append("image", image)
    imageForm.append("section", form.section)
    imageForm.append("topic", form.topic)
    imageForm.append("subtopic", (form.subtopic[0] ?? "general"))
    imageForm.append("category", category === "diagram" ? "diagram" : "question_preview")

    // Forward the response to the backend to image the questions in Cloudinary
    const response = await fetch("/api/document-processing/upload-question-image", {
        method: 'POST',
        body: imageForm
    })


    if (!response.ok) {
        const error = await response.json()
        console.error("422 Detail:", JSON.stringify(error, null, 2))
        throw new Error("Failed to upload Question Image")
    }
    return await response.json()
}


// Calls the APIs to add new questions in the bronze.raw_questions and insert into the silver.clean_questions
export async function addQuestions(question: IncomingSilverQuestions[]){
    const response = await fetch('/api/document-processing/add-questions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(question)
    })

    if (!response.ok) {
        const error = await response.json()
        console.error("422 Detail:", JSON.stringify(error, null, 2))
        throw new Error(error.detail || "Failed to add question")
    }

    const data = await response.json()
    return data
}