import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import { IncomingAnswerExplanations } from "./answer-explanations"


// File Upload Information
export type FileUpload = {
    onFile: (file: File | null) => void // tells parent which file to upload
    previewURL: string
    resetUpload: () => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    inputRef: React.RefObject<HTMLInputElement | null>
}

// Category to determine whether to upload the image to cloudinary and save to database as a diagram or question_preview
export type ImageCategory = "diagram" | "question_preview"


// PDFs and workbooks information ----------------------------------------------------------------------------------------
export type QuestionFileInfo = {
    file?: File | null
    section: string
    topic: string
    subtopic: string
    source: string
}

// Base Questions Paramaters that both silver and bronze questions tables have ------------------------------------------------
export type BaseQuestion = {
    section: string
    topic: string

    question_type: string
    question_preview: string
    mc_preview?: string

    text: string 
    reading_question: string
    multiple_choices?: MCProps | null
    answer_key?: string | string[]

}

export type IncomingBronzeQuestions = BaseQuestion & {
    question_id: string 
    subtopic: string 
    source: string
    reviewed: string
}

export type IncomingSilverQuestions = BaseQuestion & {
    question_id?: string
    subtopic: string[] | []

    difficulty?: string
    time_estimate?: number

    equation?: string
    diagram?: string

    source?:string
}


export type QuestionEditorForm = BaseQuestion & IncomingSilverQuestions & {
    reviewed: string
}


// MC Props --------------------------------------------------------------------------------------------------------
export type MCProps = {
    A: string
    B: string
    C: string
    D: string
}

// Question Search Filters ----------------------------------------------------------------------------------------
export type SearchFilters = {
    section: string | undefined 
    topic: string | undefined 
    subtopic: string | undefined 
    source: string | undefined 
}

export type SearchParameters = {
    question_id: string | undefined 
    section: string | undefined 
    topic: string | undefined 
    subtopic: string | undefined 
    text: string | undefined 
    reviewed?: boolean | undefined 
    source: string | undefined 
}


export type UseFileUploaderReturn = ReturnType<typeof useFileUploader>


export type AnyQuestion = IncomingBronzeQuestions | IncomingSilverQuestions

export type QuestionSearchResults = {
    question: AnyQuestion 
    explanation: IncomingAnswerExplanations | null
}