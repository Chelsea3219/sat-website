"use client";


import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, {useEffect} from "react";
import {Bold, Italic, LucideUnderline, Sigma, Braces} from "lucide-react";


type TextProps = {
    text: string,
    fieldChangeAction : (value:string) => void
}

export default function TextEditor({text, fieldChangeAction}:TextProps) {
    const buttonClass = "w-6 h-6 rounded hover:bg-primary/30 transition-all"
    const editor = useEditor({
        extensions: [StarterKit],
        content: text,
        immediatelyRender: false,
        editorProps: { // Makes sure the editor is styled correctly and has a minimum height
            attributes: {
                class: "outline-none break-words [overflow-wrap:anywhere] min-h-25",
            },
        },
        onUpdate : ({editor} )=> fieldChangeAction(editor.getHTML())
    })

    useEffect(()=> {
        if (editor && text !== editor.getHTML()) {
            editor.commands.setContent(text)
        }
    }, [text, editor])

    if (!editor) return null

    const wrapWith = (open: string, close: string) => {
        const { from, to, empty } = editor.state.selection
        const selected = empty ? "" : editor.state.doc.textBetween(from, to, " ")

        editor
            .chain()
            .focus()
            .insertContentAt({ from, to }, { type: "text", text: `${open}${selected}${close}` })
            // Cursor inside the brackets, or the wrapped text stays selected
            .setTextSelection({ from: from + open.length, to: from + open.length + selected.length })
            .run()
    }

    return (
        <>
            <div className="border border-primary rounded-lg p-2 min-h-30">
                <div className="flex flex-wrap gap-2 mb-2 pb-1 border-b border-primary">
                    <Bold
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`${buttonClass} ${editor.isActive('bold') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <Italic
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${buttonClass} ${editor.isActive('italic') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <LucideUnderline
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`${buttonClass} ${editor.isActive('underline') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <Sigma
                        onClick={() => wrapWith("\\(", "\\)")}
                        className={`${buttonClass} ${editor.isActive('sigma') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <Braces
                        onClick={() => wrapWith("{", "}")}
                        className={`${buttonClass} ${editor.isActive('braces') ? 'bg-primary/30' : 'text-black'}`}
                    />
                </div>


                <EditorContent
                    editor={editor}
                    className="prose max-w-none w-full min-w-0 text-sm font-medium p-2"
                    
                />
            </div>
        </>
    )
}