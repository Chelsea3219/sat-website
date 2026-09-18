import Link from "next/link"

type WeaknessProps = {
    weaknesses: {
        subtopic: string
        section: string
        score: number
    }[]
}

export default function WeaknessCard({weaknesses}: WeaknessProps) {

    // Guard 
    if (!weaknesses || weaknesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <span className="text-2xl">🎉</span>
                <span className="text-slate-600 font-semibold">No weaknesses yet — keep practicing!</span>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full">
                <span className="uppercase text-xl text-gray-600 flex items-center justify-center font-bold">Weaknesses</span>

                {weaknesses.map(({subtopic, section, score}) => {

                    return (
                        <div key={subtopic} className="flex flex-row justify-between">
                            <div className="flex flex-row space-x-2 items-center justify-center">
                                <Link
                                    href={`/dashboard/practice/${subtopic}`}
                                    className="text-md text-slate-600 hover:font-semibold hover:text-accent cursor-pointer transition-all"
                                >
                                    {subtopic}
                                </Link>
                                <p className="text-primary text-xs italic font-semibold">{section[0]}</p>
                            </div>
                            <span className="text-md text-slate-600">{score}%</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}