
import LaTexInput from "@/components/forms/ui/LaTexInput";
import SnippetButtons from "@/components/forms/ui/SnippetButtons";


type MCProps = {
    A: string
    B: string
    C: string
    D: string
}

type MCEditorProps = {
    mc: MCProps
    onChangeAction : (letter: keyof MCProps, value: string) => void
}

export default function MCEditor({mc, onChangeAction}: MCEditorProps) {


    return (
        
        <div className="w-full min-w-0 border border-primary rounded-lg p-2 min-h-30">

           <div className="border-b border-primary pb-2 mb-2 ">
                <SnippetButtons />
           </div>

            {/* Multiple Choice */}
            <div className="flex flex-col space-y-4 w-full">
                {(["A", "B", "C", "D"] as const).map(letter => (
                    <div
                        key={letter}
                        className="flex items-start gap-2"
                    >
                        {/* Letter */}
                        <div className="text-xl text-slate-900">
                            {letter}
                        </div>

                        {/* MC */}
                        <LaTexInput
                            value={mc[letter]}
                            onChangeAction={(value) => onChangeAction(letter, value)}
                            className="flex-1 w-full"
                        />
                </div>
                ))}
            </div>
        </div>
    )
}