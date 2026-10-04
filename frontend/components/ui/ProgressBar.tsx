
type ProgressBarProps = {
    completed: number
    numQuestions:number
    showProgress?: boolean
}

export const ProgressBar = ({completed, numQuestions, showProgress}: ProgressBarProps) => {
    const percent = numQuestions > 0
        ? (completed / numQuestions) * 100
        : 0

    return (
        <div className="flex-1 min-w-0 flex-row items-center justify-center w-64 gap-x-2">

            <div className="w-full h-4 bg-white rounded-full border border-primary overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full  transition-[width] duration-500 ease-out"
                    style={{ width: `${percent}%`, minWidth: percent > 0 ? '1.25rem' : 0 }}
                />
            </div>

            {showProgress && <div className="uppercase text-primary text-lg font-bold whitespace-nowrap">{completed}/{numQuestions}</div>}
        </div>
    )
}