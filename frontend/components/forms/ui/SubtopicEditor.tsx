
import {X,Plus} from 'lucide-react'

type Props = {
    subtopic: string | string[]
    onChangeAction: (subtopic: string[]) => void
}


export default function SubtopicEditor({subtopic, onChangeAction}:Props) {

    // Normalizes the subtopic array
    const subtopics: string[] = Array.isArray(subtopic) // Checks to see if it is an array
        ? subtopic as string[] // If true, use it (case as string[])
        : subtopic ? [subtopic as string] // If it's a string, wrap it in an array
            : [] // If it's null/undefined, return an empty

    // Add subtopic
    const addSubtopic = () => onChangeAction([...subtopics, ""])

    // Remove subtopic
    const removeSubtopic = (index:number) => onChangeAction(subtopics.filter((_, i) => i !== index))

    // Update the subtopic field
    const subtopicFieldChange = (index:number, value:string) => {
        const updated = [...subtopics]
        updated[index] = value
        onChangeAction(updated)
    }

    return (
        <div className="flex flex-row gap-3">
            {subtopics.map((value:string, index:number)=> (
                <div key={index} className="group flex items-center gap-2 p-2 bg-white border rounded-lg transition-all hover:shadow-sm">
                    <input
                        value={value}
                        onChange={(e) => subtopicFieldChange(index, e.target.value)}
                    />
                    <X
                        onClick={()=> removeSubtopic(index)}
                        className="w-8 h-8 cursor-pointer opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    />
                </div>
            ))}
            <Plus
                onClick={(value) => addSubtopic()}
                className=" w-10 h-10 self-center text-primary cursor-pointer hover:text-accent hover:font-bold"
            />
        </div>
    )
}