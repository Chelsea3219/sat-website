
export type ExplanationSteps = {
    step_number: number 
    type: "concept" | "calculation" | "reasoning" | "evidence" | "verification" | "desmos"
    title: string
    content: {
        type: "text" | "latex" | "image"
        value: string
    }[]
}

export type IncomingAnswerExplanations = {
    answer_id: string 
    question_id: string 

    answer_key: string | string[]
    question_explanation: string | null 
    ai_answer_explanation: {
        description: string 
        steps: ExplanationSteps[]
    }

    hint_1: string
    hint_2 : string | null

    status: string 
    model_name: string 
    created_at: string
    updated_at: string
}


export type ExplanationValue =
    IncomingAnswerExplanations["ai_answer_explanation"]


export type ContentItem = ExplanationSteps["content"][number]


export type JSONEditorProps = {
    value: ExplanationValue | null
    onChange: (value: ExplanationValue) => void
}