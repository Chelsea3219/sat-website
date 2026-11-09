// components/forms/ui/RichContentEditor.tsx
"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

type Props = {
    value: string
    onChangeAction: (html: string) => void
    className?: string
}

export default function RichContentEditor({ value, onChangeAction, className = "" }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,                              // avoids hydration mismatch in Next.js
        onUpdate: ({ editor }) => onChangeAction(editor.getHTML()),
    })

    // Load new content when a different question is opened
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
    }, [editor, value])

    return <EditorContent editor={editor} className={className} />
}