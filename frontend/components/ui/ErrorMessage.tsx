


type Props = {
    error: string | null
    onDismiss?: () => void
}

export default function ErrorMessage({error, onDismiss}:Props) {
    if (!error) return null // don't render anything ig no error

    return (
        <div className="bg-red-100 text-sm p-3 rounded-md flex gap-3 border border-red-700 max-sm:items-start dark:bg-red-900/20 dark:border-red-800/40"
            role="alert"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-red-700">{error}</p>
            </div>
            <button
                type="button"
                aria-label="Dismiss error alert"
                className="dismiss-btn ml-auto flex items-center opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                onClick={onDismiss}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-2.5 cursor-pointer fill-red-800 dark:text-red-400"
                aria-hidden="true" viewBox="0 0 329.269 329">
                <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
                </svg>
            </button>
        </div>
    )
}