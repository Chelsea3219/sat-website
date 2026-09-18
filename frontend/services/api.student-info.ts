

export async function fetchStudentInformation(clerk_id: string ) {
    const res = await fetch(`/api/students/fetch-student-info/${clerk_id}`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch student's information")
    }
    const data = await res.json()

    return data 
}