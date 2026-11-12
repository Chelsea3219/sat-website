import { useId } from "react"

type Props = {
    label: string 
    value: string | string[]
    type: "select" | "input" | "textarea" 
    options?: string[]
    fieldChangeAction: (value:string) => void     
    labelStyle:string  
}



export default function RenderFormField({ label, value, type, options = [], fieldChangeAction, labelStyle}: Props) {
    const id = useId()
    const fieldClass = "w-full bg-white rounded-md p-1 border border-primary text-gray-700 h-7"

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className={labelStyle} aria-hidden >{label}</label>

            {type === "select" ? (
                <select
                    id={id}
                    value={value ?? ""}
                    onChange={(e) => fieldChangeAction(e.target.value)}
                    className={fieldClass}
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    id={id}
                    value={value ?? ""}
                    onChange={(e) => fieldChangeAction(e.target.value)}
                    placeholder={label}
                    className={`w-full bg-white rounded-md p-1 text-gray-700 min-h-28 ${fieldClass}`}
                />
            ) : (
                <>
                    <input
                        id={id}
                        list={options.length ? `${id}-options` : undefined}
                        value={value ?? ""}
                        onChange={(e) => fieldChangeAction(e.target.value)}
                        placeholder={label}
                        className={fieldClass}
                    />
                    {options.length > 0 && (
                        <datalist id={`${id}-options`}>
                            {options.map((o) => <option key={o} value={o} />)}
                        </datalist>
                    )}
                </>
            )}
        </div>
    )
}