"use client"
import Image from "next/image"

type PreviewProps = {
    question_preview: string
    mc_preview: string
}
export default function QuestionPreview({question_preview, mc_preview}:PreviewProps){
    if (!question_preview) return <p>No Question selected</p>

    return (
        <>
            {/* Question Preview */}
            <div className="input-group">
                <label>Question Preview</label>
                {question_preview
                    ? <Image src={question_preview} alt="Question preview" width={500} height={300} className="w-full h-auto" />
                    : <p className=" flex justify-center text-sm">No image </p>
                    }
            </div>
            <div className="input-group">
                <label>MC Preview</label>
                {mc_preview
                    ? <Image src={mc_preview} alt={`Question preview`} className="w-full" width={500} height={300} />
                    : <p className=" flex justify-center text-sm">No image </p>
                    }
            </div>
        </>
    )
}