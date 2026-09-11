
// Fetch quiz questions for a specific clerk_id and section
export async function fetchQuizQuestions(clerk_id: string, section: string) {
    const res = await fetch(`/api/questions/quiz/fetch-questions/${clerk_id}/${section}`, {
        method: 'GET'
    })

    if (!res.ok) throw new Error("Failed to fetch quiz questions")
    const data = await res.json()

    return data 
}