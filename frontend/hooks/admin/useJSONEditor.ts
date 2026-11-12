import { ExplanationSteps, ExplanationValue, ContentItem } from "@/types/answer-explanations"

type Props = {
    value: ExplanationValue | null
    onChange: (value: ExplanationValue) => void
}

export default function useJSONEditor({ value, onChange }: Props) {

    const explanation = value ?? {description: "", steps: []}

    const updateExplanation = (updated: Partial<ExplanationValue>) => { onChange({ ...explanation, ...updated }) }

    const updateStep = ( index: number, updated: Partial<ExplanationSteps> ) => {
        const steps = [...explanation.steps]
        if (!steps[index]) return
        steps[index] = { ...steps[index], ...updated}
        updateExplanation({ steps })
    }

    const addStep = () => {
        const newStep: ExplanationSteps = {
            step_number: explanation.steps.length + 1,
            type: "concept",
            title: "",
            content: [
                { type: "text", value: "" }
            ]
        }
        updateExplanation({ steps: [...explanation.steps, newStep] })
    }

    const removeStep = (index: number) => {
        const steps = explanation.steps
            .filter((_, i) => i !== index)
            .map((step, i) => ({
                ...step,
                step_number: i + 1
            }))

        updateExplanation({ steps })
    }

    const moveStep = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction

        if (newIndex < 0 || newIndex >= explanation.steps.length) return

        const steps = [...explanation.steps]

        ;[steps[index], steps[newIndex]] = [steps[newIndex], steps[index]]

        updateExplanation({
            steps: steps.map((step, i) => ({
                ...step,
                step_number: i + 1
            }))
        })
    }

    const updateContent = (
        stepIndex: number,
        contentIndex: number,
        updated: Partial<ContentItem>
    ) => {
        const step = explanation.steps[stepIndex]

        const content = [...step.content]

        content[contentIndex] = {
            ...content[contentIndex],
            ...updated
        }

        updateStep(stepIndex, { content })
    }

    const addContent = (stepIndex: number) => {
        const step = explanation.steps[stepIndex]

        updateStep(stepIndex, {
            content: [
                ...step.content,
                { type: "text", value: "" }
            ]
        })
    }

    const removeContent = ( stepIndex: number, contentIndex: number ) => {
        const step = explanation.steps[stepIndex]
        updateStep(stepIndex, {
            content: step.content.filter((_, i) => i !== contentIndex)
        })
    }

    return {
        explanation,
        updateExplanation,
        updateStep,
        addStep,
        removeStep,
        moveStep,
        updateContent,
        addContent,
        removeContent, 
    }
}