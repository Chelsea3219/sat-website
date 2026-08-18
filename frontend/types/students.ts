// User Registration Information
export type UserRegistration = {
    clerk_id: string
    first_name: string
    last_name: string
    email: string

    school: string
    state: string
    grade_level: string
    original_score: {
        original_score: number
        reading_score: number
        math_score: number
    }
    dream_score: number
    test_date: string

    subscription: "free" | "starter" | "advanced"
    referral: string
    learning_targets: {
        daily_goal: number
        weekly_goal: number
    }
}