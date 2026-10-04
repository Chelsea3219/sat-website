"use client"

import {X,Plus} from 'lucide-react'

type Props = {
    answer: string | string[]
    onChangeAction: (answer: string[]) => void
}


export default function AnswerEditor({answer, onChangeAction}:Props) {

    const answerKey : string[] = Array.isArray(answer) ? answer : answer ? [answer] : [""]

    // Add answer
    const addAnswer = () => onChangeAction([...answerKey, ""])

    // Remove answer
    const removeAnswer = (index:number) => onChangeAction(answerKey.filter((_, i) => i !== index))

    // Update the answer field
    const answerFieldChange = (index:number, value:string) => {
        const updated = [...answerKey]
        updated[index] = value
        onChangeAction(updated)
    }

    return (
        <div className="flex flex-row gap-3">
            {answerKey.map((value:string, index:number)=> (
                <div key={index} className="group flex items-center gap-2 p-2 bg-white border rounded-lg transition-all hover:shadow-sm">
                    <input
                        value={value}
                        onChange={(e) => answerFieldChange(index, e.target.value)}
                    />
                    <X
                        onClick={()=> removeAnswer(index)}
                        className="w-8 h-8 cursor-pointer opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    />
                </div>
            ))}
            <Plus
                onClick={(value) => addAnswer()}
                className=" w-10 h-10 self-center text-primary cursor-pointer hover:text-accent hover:font-bold"
            />
        </div>
    )
}