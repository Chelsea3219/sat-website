
export type IncomingAnswerExplanations = {
    answer_id: string 
    question_id: string 

    answer_key: string 
    question_explanation: string
    ai_answer_explanation: JSON

    hint_1: string
    hint_t : string | null

    status: string 
    model_name: string 
    created_at: string
    updated_at: string
}