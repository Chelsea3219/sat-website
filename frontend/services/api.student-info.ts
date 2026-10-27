

export async function fetchStudentInformation() {
    const res = await fetch(`/api/students/fetch-student-info`, {
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


export async function fetchDailyWeeklysStats() {
    const res = await fetch(`/api/students/fetch-daily-stats`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch daily and weekly stats")
    }
    const data = await res.json()

    return data 
}

export async function fetchPastQuizAnalytics( ) {
    // Returns the past 10 quizzes and the number of quizzes
    const res = await fetch(`/api/analytics/past-quiz-analytics`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch past quiz analytics.")
    }
    const data = await res.json()

    return data 
}


export async function fetchCurrentSubtopicMastery(subtopic: string) {
    // Returns the current analytics for the selected subtopic
    const res = await fetch(`/api/analytics/past-subtopic-analytics/${subtopic}`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch past analytics for the selected subtopic.")
    }
    const data = await res.json()

    return data 
}


export async function fetchAchievements() {
    // Returns the past 10 quizzes and the number of quizzes
    const res = await fetch(`/api/achievements`, {
        method: 'GET'
    })

    if (!res.ok) {
        const text = await res.text()
        console.error("API error:", res.status, text)
        throw new Error("Failed to fetch student's achievements.")
    }
    const data = await res.json()
    return data 
}