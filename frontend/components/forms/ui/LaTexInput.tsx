"use client"


import { forwardRef} from "react";
import katex from 'katex'; 
import 'katex/dist/katex.min.css'
import {formatLatex} from "@/utils/latexHelpers"


type LaTexInputProps = {
    value: string
    onChangeAction: (value: string) => void
    onKeyDownAction?: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => void  // ← widen the type
    className?: string
}

const LatexInput = forwardRef<HTMLTextAreaElement, LaTexInputProps>(({ value, onChangeAction, onKeyDownAction, className}, ref) => {

    const rendered = katex.renderToString(formatLatex(value) || "\\space", {
        throwOnError: false, // half typed LaTeX will show up in red and not throw an error
        displayMode: false, // renders inline-sezed math rather than a large centered block
    })
    
    return (
        <div className={`flex gap-4 w-full ${className ?? ""}`}>

            <textarea
                ref={ref}
                className="flex-1 border rounded p-2"
                rows={2}
                value={value}
                onChange={e => onChangeAction(e.target.value)}
                placeholder="Type text or LaTeX e.g. $x^2 + y^2$"
                onKeyDown={onKeyDownAction}
            />

            <div
                className="flex-1 min-w-0 overflow-x-auto border rounded p-2 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: rendered }}
            />

        </div>
    )
})

LatexInput.displayName = "LatexInput"  // ← needed for forwardRef components

export default LatexInput