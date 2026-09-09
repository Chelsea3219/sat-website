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