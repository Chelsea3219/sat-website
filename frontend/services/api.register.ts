import type { UserRegistration } from "@/types/students"

// Calls the API to register new users in the dataframe
export async function registerUser(userInfo: UserRegistration) {
    const response = await fetch("api/register", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userInfo),
    })

    const data = await response.json()
    return data
}