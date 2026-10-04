import LaTexInput from "@/components/forms/ui/LaTexInput";

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
    )
}