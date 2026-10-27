"use client"

import { useEffect, useRef } from "react"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"

type Props = {
    content: string
    className?: string
}

export default function ReadOnlyContent({ content, className = "" }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        el.innerHTML = content
        renderMathInElement(el, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\[", right: "\\]", display: true },
                { left: "\\(", right: "\\)", display: false },
            ],
            throwOnError: false,   // bad LaTeX shows as red text instead of crashing
        })
    }, [content])

    return <div ref={ref} className={className} />
}




{/* 
    "use client"
    import { useEditor, EditorContent } from "@tiptap/react"
    import StarterKit from "@tiptap/starter-kit"

    export default function ReadOnlyContent({ content, className}: {
        content: string
        className:string
    }) {
        const editor = useEditor({
            extensions: [StarterKit],
            content: content,
            editable: false,   // read only, no cursor or editing
        })

        return <EditorContent editor={editor} className = {className}/>
    }

*/}