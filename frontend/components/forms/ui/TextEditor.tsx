"use client";


import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, {useEffect} from "react";
import {Bold, Italic, LucideUnderline} from "lucide-react";
import Underline from "@tiptap/extension-underline";

type TextProps = {
    text: string,
    fieldChangeAction : (value:string) => void
}

export default function TextEditor({text, fieldChangeAction}:TextProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: text,
        immediatelyRender: false,
        onUpdate : ({editor} )=> fieldChangeAction(editor.getHTML())
    })

    useEffect(()=> {
        if (editor && text !== editor.getHTML()) {
            editor.commands.setContent(text)
        }
    }, [text, editor])

    if (!editor) return null

    return (
        <>
            <div className="border border-primary rounded-lg p-2 min-h-[120px]">
                <div className="flex flex-wrap gap-2 mb-2 pb-1 border-b border-primary">
                    <Bold
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`w-6 h-6 rounded ${editor.isActive('bold') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <Italic
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`w-6 h-6 rounded ${editor.isActive('italic') ? 'bg-primary/30' : 'text-black'}`}
                    />
                    <LucideUnderline
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`w-6 h-6 rounded ${editor.isActive('underline') ? 'bg-primary/30' : 'text-black'}`}
                    />
                </div>
                <EditorContent
                    editor={editor}
                    className="prose text-sm font-medium min-h-[100px] p-2 overflow-hidden break-words"
                    style={{width: '100%'}}
                />
            </div>
        </>
    )
}