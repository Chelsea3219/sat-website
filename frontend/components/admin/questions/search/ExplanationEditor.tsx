"use client"

import { IncomingAnswerExplanations, ExplanationValue} from "@/types/answer-explanations"
import RenderFormField from "../ui/RenderFormField";
import JSONEditor from "./JSONEditor";
import ExplanationPreview from "./ExplanationPreview";
import SubtopicEditor from "@/components/admin/questions/ui/SubtopicEditor";

// Declare the types
type Props = {
    answerExplanation: IncomingAnswerExplanations | null 
    fieldChangeAction: <K extends keyof IncomingAnswerExplanations>(field: K, value:IncomingAnswerExplanations[K]) => void
}

const labelStyle = "uppercase tracking-wide text-primary text-xs"
const fieldClass = "w-full bg-white rounded-md p-1 border border-primary text-gray-700 h-7"




export default function ExplanationEditor({ answerExplanation, fieldChangeAction }: Props) {

    return (
        <div className="p-4 space-y-6">

            {/* Answer Key */}
            <div>
                <label className={labelStyle}>Answer Key(s)</label>
                <SubtopicEditor subtopic={answerExplanation?.answer_key ?? []} onChangeAction={(value) => fieldChangeAction("answer_key", value)} />
            </div>
            

            {/* Hints */}
            <label className={labelStyle}>Hint(s)</label>
            {(["hint_1", "hint_2"] as const).map((hint, index) => (
                <div key={hint} className="flex items-start flex-row gap-2">
                    <p className="text-primary font-semibold mt-1">{index+1}</p>
                    <textarea
                        id={hint}
                        rows={2}
                        value={answerExplanation?.[hint] ?? ""}
                        onChange={e => fieldChangeAction(hint, e.target.value)}
                        placeholder={`Enter a hint`}
                        className={`${fieldClass} min-h-14`}
                        />
                </div>
            ))}

            {/* Question Explanation */}
            <RenderFormField 
                label="Question Explanation" 
                type="textarea"
                value={answerExplanation?.question_explanation ?? ""} 
                fieldChangeAction={(value) => fieldChangeAction("question_explanation", value)}
                labelStyle={labelStyle}
            />

            {/* Edited Explanation */}
            <div>
                <label className={labelStyle}>Final Answer Explanation</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                    {/* JSON Editor */}
                    <div className="min-w-0 h-150 overflow-y-auto border border-primary rounded-lg p-2">
                        <JSONEditor
                            value={answerExplanation?.ai_answer_explanation ?? null}
                            onChange={(value:ExplanationValue) => fieldChangeAction("ai_answer_explanation", value)}
                        />
                    </div>

                    {/* Preview */}
                    <div className="min-w-0 h-150 overflow-y-auto">
                        <div className="border border-primary rounded-lg p-4 min-h-full">
                            <ExplanationPreview explanation={answerExplanation ?? null} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}