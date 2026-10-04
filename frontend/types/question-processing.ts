import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"

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

// PDFs and workbooks information
export type QuestionInfo = {
    file?: File | null
    section: string
    topic: string
    subtopic: string
    source: string
}

export type BaseBronzeQuestions = {
    section: string
    topic: string
    subtopic: string
    question_type: string
    question_preview: string
    mc_preview?: string
    text:string
    uploaded_at: string
    source: string
    reviewed: string
}

export type IncomingBronzeQuestions = BaseBronzeQuestions & {
    question_id: string 
    uploaded_at: string
    reviewed: string
}

export type IncomingSilverQuestions = {
    question_id?: string
    section: string
    topic: string
    subtopic: string[]

    difficulty?: string
    time_estimate?: number

    question_type: string
    question_preview: string
    mc_preview?: string

    text:string
    equation?: string
    diagram?: string

    multiple_choices?:{
        A: string
        B: string
        C: string
        D: string
    } | null
    answer_key?: string | string[]
    source?:string
}

export type QuestionSearchParameters = {
    section?: string
    topic?: string
    subtopic?: string
}


// MC Props
export type MCProps = {
    A: string
    B: string
    C: string
    D: string
}


export type SearchProps = {
    searchName: string
    searchValue: string
}


export type UseFileUploaderReturn = ReturnType<typeof useFileUploader>