"use client"

import { useState } from "react";
import LaTexInput from "@/components/forms/ui/LaTexInput";
import SnippetButtons from "@/components/forms/ui/SnippetButtons";
import {wrapSigma, unwrapSigma} from "@/utils/latexHelpers";

const wrapMC = (mc: MCProps, enabled: boolean): MCProps => {
    const transform = (value: string) => {
        if (!value.trim()) return value;

        return enabled
            ? wrapSigma(value)
            : unwrapSigma(value);
    };

    return {
        A: transform(mc.A),
        B: transform(mc.B),
        C: transform(mc.C),
        D: transform(mc.D),
    };
};


type MCProps = {
    A: string
    B: string
    C: string
    D: string
}

type MCEditorProps = {
    mc: MCProps
    isEquation?: boolean
    onChangeAction : (letter: keyof MCProps, value: string) => void
}

export default function MCEditor({mc, isEquation=false,  onChangeAction}: MCEditorProps) {

    const [equationMode, setEquationMode] = useState(isEquation)

    const toggleDelimiters = () => {
        const next = !equationMode;

        // Update all four choices in the form data.
        const updatedMC = wrapMC(mc, next);

        (["A", "B", "C", "D"] as const).forEach((letter) => {
            onChangeAction(letter, updatedMC[letter]);
        });

        // Update the preview mode.
        setEquationMode(next);
    };

    return (
        
        <div className="w-full min-w-0 border border-primary rounded-lg p-2 min-h-30">

            <div className="flex items-center justify-between border-b border-primary pb-2 mb-2">
                <SnippetButtons />

                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <span>Delimiters</span>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={equationMode}
                        onClick={toggleDelimiters}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                            equationMode ? "bg-primary" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                equationMode ? "translate-x-5" : ""
                            }`}
                        />
                    </button>
                </label>
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
                            isEquation={equationMode}
                            onChangeAction={(value) => onChangeAction(letter, value)}
                            className="flex-1 w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}