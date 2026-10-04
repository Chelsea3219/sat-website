import { IncomingBronzeQuestions, IncomingSilverQuestions } from "@/types/question-processing"

// Add time_estimate based on difficulty
export default function timeEstimate(difficulty:string)  {
    const difficutlyToTime: Record<string, number> = {
        easy: 30,
        medium: 60,
        hard: 90
    }
    return difficutlyToTime[difficulty] ?? 0
}

// Preprocess the form so that when the questions go from bronze to silver, there are no uncontrolled fields (2 tables with different fields)
export const preprocessForm = (q:IncomingBronzeQuestions): IncomingSilverQuestions => {
    //console.log("raw bronze question:", q)
    return {
        question_id: q.question_id,
        section: q.section,
        topic: q.topic,
        subtopic: q.subtopic ? [q.subtopic] : [], // If a string, convert to a list, else an empty list
        question_preview: q.question_preview,
        question_type: q.question_type,
        mc_preview: q.mc_preview ?? "",
        text: q.text,
        difficulty: "",
        time_estimate:0,
        equation:"",
        diagram:"",
        multiple_choices:{
            A: "", B: "", C: "", D:""
        },
        answer_key: "",}
}

// Validate the form for missing information -----------------------------------------------------------------------
export const validateEditorForm = (form: IncomingSilverQuestions) => {
    const missing: string[] = []

    const missingFields: (keyof IncomingSilverQuestions)[] = ["difficulty", "text", "answer_key"]
    missingFields.forEach(i => {
        if (!form[i]) missing.push(i)
    })

    console.log("missing", missing)
    return missing
}
