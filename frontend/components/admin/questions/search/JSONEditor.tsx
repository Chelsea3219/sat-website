"use client"

import useJSONEditor from "@/hooks/admin/useJSONEditor";
import { ExplanationSteps, ContentItem, JSONEditorProps } from "@/types/answer-explanations"
import TextEditor from "@/components/admin/questions/ui/TextEditor"
import SnippetButtons from "@/components/admin/questions/ui/SnippetButtons"

// Initializes the types 
const stepTypes = [ "concept", "calculation", "reasoning", "evidence", "verification","desmos"] as const
const contentTypes = ["text", "latex", "image"] as const

// Styles
const labelStyle = "uppercase tracking-wide text-main text-xs"
const inputStyle = "w-full rounded-md border border-primary p-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
const buttonStyle = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors"



export default function JSONEditor({value, onChange}: JSONEditorProps) {

    const { explanation, updateExplanation, updateStep, addStep, removeStep, moveStep, updateContent, addContent, removeContent } = useJSONEditor({ value, onChange })


    return (
        <div className="space-y-4 ">

            {/* Description */}
            <div className="space-y-2">
                <label className={labelStyle}>Explanation Description </label>
                <TextEditor text={explanation.description} fieldChangeAction={(value) => updateExplanation({ description: value })} />
            </div>

            {/* Steps */}
            <div className="space-y-4">

                <div className="flex items-center justify-between">
                    <h3 className={labelStyle}>
                        Explanation Steps ({explanation.steps.length})
                    </h3>

                    <button
                        type="button"
                        onClick={addStep}
                        className={`${buttonStyle} bg-primary text-white hover:opacity-90`}
                    >
                        + Add Step
                    </button>
                </div>

                {explanation.steps.map((step, stepIndex) => (
                    <div
                        key={stepIndex}
                        className="space-y-4 rounded-lg border border-gray-200 p-4"
                    >

                        {/* Step Header */}
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-primary">
                                Step {step.step_number}
                            </h4>

                            {/* Step Navigation and Remove*/}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={stepIndex === 0}
                                    onClick={() => moveStep(stepIndex, -1)}
                                    className={`${buttonStyle} border border-gray-300 disabled:opacity-40`}
                                >
                                    ↑
                                </button>

                                <button
                                    type="button"
                                    disabled={stepIndex === explanation.steps.length - 1}
                                    onClick={() => moveStep(stepIndex, 1)}
                                    className={`${buttonStyle} border border-gray-300 disabled:opacity-40`}
                                >
                                    ↓
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeStep(stepIndex)}
                                    className={`${buttonStyle} bg-red-50 text-red-600 hover:bg-red-100`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Step Title */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    Step Title
                                </label>

                                <input
                                    value={step.title}
                                    onChange={e =>
                                        updateStep(stepIndex, {
                                            title: e.target.value
                                        })
                                    }
                                    placeholder="e.g. Identify the equation"
                                    className={inputStyle}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    Step Type
                                </label>

                                <select
                                    value={step.type}
                                    onChange={e =>
                                        updateStep(stepIndex, {
                                            type: e.target.value as ExplanationSteps["type"]
                                        })
                                    }
                                    className={inputStyle}
                                >
                                    {stepTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Content Items */}
                        <div className="space-y-3 border-t border-gray-200 pt-3">

                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-700">
                                    Step Content
                                </h5>

                                <button
                                    type="button"
                                    onClick={() => addContent(stepIndex)}
                                    className="text-xs font-semibold bg-green-600 text-white hover:opacity-50 rounded-md py-1 px-2"
                                >
                                    + Add Content
                                </button>
                            </div>

                            {step.content.map((item, contentIndex) => (
                                <div
                                    key={contentIndex}
                                    className="space-y-2 rounded-md bg-gray-50 p-3"
                                >

                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-gray-600">
                                            Content {contentIndex + 1}
                                        </label>
                                    </div>

                                    <select
                                        value={item.type}
                                        onChange={e =>
                                            updateContent(stepIndex, contentIndex, {
                                                type: e.target.value as ContentItem["type"]
                                            })
                                        }
                                        className={inputStyle}
                                    >
                                        {contentTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-col gap-2 border border-primary rounded-md p-2">
                                        <SnippetButtons/>
                                        <textarea
                                        rows={item.type === "latex" ? 4 : 3}
                                        value={item.value}
                                        onChange={e =>
                                            updateContent(stepIndex, contentIndex, {
                                                value: e.target.value
                                            })
                                        }
                                        placeholder={
                                            item.type === "latex"
                                                ? "Enter LaTeX expression..."
                                                : item.type === "image"
                                                    ? "Enter image URL..."
                                                    : "Enter explanation content..."
                                        }
                                        className={inputStyle}
                                    />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeContent(stepIndex, contentIndex)
                                        }
                                        className="text-xs font-semibold bg-red-600 text-white hover:opacity-50 rounded-md py-1 px-2"
                                    >
                                        - Remove
                                    </button>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {explanation.steps.length === 0 && (
                    <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                        No explanation steps yet. Click Add Step to begin.
                    </p>
                )}
            </div>
        </div>
    )
}
