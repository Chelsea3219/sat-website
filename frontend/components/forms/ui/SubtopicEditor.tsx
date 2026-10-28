
import {X,Plus} from 'lucide-react'
import CreatableSelect from "react-select/creatable"
import {SUBTOPICS} from "@/utils/admin/subtopics"

type Props = {
    subtopic: string | string[]
    onChangeAction: (subtopic: string[]) => void
}

type Option = { label: string; value: string }
const toOption = (s: string): Option => ({ label: s, value: s })


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
        <>
            {/*
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
            */}

            <CreatableSelect
                inputId="subtopic"
                isMulti
                placeholder="Type or pick a subtopic"
                options={SUBTOPICS.map(toOption)}              // your existing subtopic list
                value={subtopics.map(toOption)}
                onChange={(selected) => onChangeAction(selected.map((o) => o.value))}
                formatCreateLabel={(input) => `Add "${input.trim().toLowerCase()}"`}
                getNewOptionData={(input) => toOption(input.trim().toLowerCase())}
                noOptionsMessage={() => "Type to add a new subtopic"}
                classNames={{
                    control: ({ isFocused }) =>
                        `min-h-10 rounded-lg border bg-white px-2 py-1 transition-all ${
                            isFocused ? "border-primary ring-2 ring-primary/30" : "border-secondary hover:border-primary/60"
                        }`,
                    valueContainer: () => "gap-1.5",
                    placeholder: () => "text-slate-400 text-sm",
                    input: () => "text-sm",
                    multiValue: () => "flex items-center gap-1 rounded-full bg-primary/10 pl-3 pr-1 py-0.5",
                    multiValueLabel: () => "text-sm text-primary",
                    multiValueRemove: () => "rounded-full p-0.5 text-primary/60 hover:bg-red-50 hover:text-red-500",
                    indicatorsContainer: () => "gap-1 text-slate-400",
                    clearIndicator: () => "p-1 rounded-md hover:text-red-500 cursor-pointer",
                    dropdownIndicator: () => "p-1 rounded-md hover:text-primary cursor-pointer",
                    indicatorSeparator: () => "hidden",
                    menu: () => "mt-2 rounded-lg border border-secondary bg-white shadow-lg overflow-hidden",
                    menuList: () => "py-1 max-h-60",
                    option: ({ isFocused, isSelected }) =>
                        `px-3 py-2 text-sm cursor-pointer ${
                            isSelected ? "bg-primary text-white" : isFocused ? "bg-primary/10" : ""
                        }`,
                    noOptionsMessage: () => "px-3 py-2 text-sm text-slate-400",
                }}
            />

        </>
        )
}