import {X} from 'lucide-react'
import type {FileUpload} from "@/types/question-processing";
import Image from "next/image"


export default function FileUploader({onFile, previewURL, resetUpload, handleChange, inputRef}: FileUpload) {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e)
        if (onFile) {
            onFile(e.target.files?.[0] ?? null)
        }
    }

    return (
        <div className ="w-full h-full">
            <div className="space-y-2">
                {/* Upload the File */}
                <div className="flex justify-center items-center mt-0.75 gap-4">
                    <input
                        type="file"
                        ref={inputRef}
                        name="file"
                        accept=".pdf, .png, .jpg"
                        onChange={handleFileChange}
                        className="
                            w-full h-full border border-primary rounded p-3 text-sm text-gray-600 cursor-pointer
                            file:mr-3 file:border-0 file:bg-secondary file:text-slate-900 file:font-semibold file:rounded-full file:px-3 file:py-2 file:cursor-pointer"
                    />
                </div>
                {previewURL && (
                    <div className="flex flex-row justify-center items-center gap-4">
                        <Image src={previewURL} alt="Diagram / Preview" width={200} height={200} className="max-w-sm border rounded-lg"/>
                        <X className="flex justify-center w-25 h-25 text-red-500 hover:bg-red-50 rounded-lg" onClick={resetUpload}/>
                    </div>
                )}
            </div>
        </div>
    )
}