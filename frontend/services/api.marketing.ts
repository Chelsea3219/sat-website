type ContactFormProps = {
    full_name: string
    email: string
    role: "student" | "parent" | "teacher" | null 
    subject: "general inquiry" | "billing/subscription" | "courses" | "web design" | "other" | null 
    message: string
}

// Uploads the contactForm to the backend
export async function uploadContactForm(contactForm: ContactFormProps) {
    const response = await fetch ("/api/landing/contact-us", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(contactForm),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data 
}