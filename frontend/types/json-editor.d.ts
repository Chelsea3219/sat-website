
declare module "@json-editor/json-editor" {
    export class JSONEditor<T = Record<string, unknown>> {
        constructor(
            element: HTMLElement,
            options: Record<string, unknown>
        )

        on(event: string, callback: () => void): void

        getValue(): T

        setValue(value: T): void

        destroy(): void
    }
}
