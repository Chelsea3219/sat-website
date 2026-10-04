import {useEffect, useRef, useState} from "react";


export default function useFileUploader() {

    const [filename, setFileName] = useState<string>("")
    const [previewURL, setPreviewURL] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)

    const resetUpload = () => {
        setFileName("")

        // if (previewURL) URL.revokeObjectURL(previewURL)
        setPreviewURL(prev => {
            if (prev) URL.revokeObjectURL(previewURL)
            return ""
        })

        if (inputRef.current) inputRef.current.value = ""
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const item = e.target.files?.[0] || null

        if (previewURL) URL.revokeObjectURL(previewURL)

        if (item) {
            setPreviewURL(URL.createObjectURL(item))
            setFileName(item.name)
        } else {
            setPreviewURL("")
            setFileName("")
        }
    }

    // Memory Cleanup since the browser allocates memory whenever there's "URL.createObjectURL(file)"
    useEffect(() => {
        return () => {
            if (previewURL) URL.revokeObjectURL(previewURL)
        }
    }, [previewURL]);

    return {filename, previewURL, resetUpload, handleChange, inputRef}
}

export function useFileInputRef() {
    return useRef<HTMLInputElement>(null)
}