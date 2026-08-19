
type ProgressBarProps = {
    completed: number
    numQuestions:number
}

export const ProgressBar = ({completed, numQuestions}: ProgressBarProps) => {
    const percent = numQuestions > 0
        ? (completed / numQuestions) * 100
        : 0

    return (
        <div className="flex flex-row items-center justify-center w-64 gap-x-2">

            <div className="w-full h-4 bg-white rounded-full border border-primary">
                <div
                    className="h-4 bg-primary rounded-full transition-[width] duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="uppercase text-primary text-lg font-bold">{completed}/{numQuestions}</div>
        </div>
    )
}