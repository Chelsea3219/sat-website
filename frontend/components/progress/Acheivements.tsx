import { Trophy, Square, SquareCheckBig } from "lucide-react"
import { tierColorChange } from "@/utils/renderColor"

type AchievementsProps = {
    cardTitleStyle: string
    achievements: Achievement[]
}


export type Achievement = {
    id: string 
    title: string
    description: string
    tier: string | null     // bronze, silver, gold
    progress: number        // current value
    target: number          // value needed for the next tier
    earned: boolean         // at least one tier earned
}


export default function Achievements({cardTitleStyle, achievements}:AchievementsProps) {

    return (

        <>
            <div className="flex flex-row space-x-2 items-center mb-2">
                <Trophy style={{strokeWidth:2}} className="text-accent w-6 h-6"/>
                <p className={`text-accent ${cardTitleStyle}`}>Achievements</p>
            </div>
            {/* TODO add more acheivements */}
            <div className = "ml-10">
                {(achievements ?? []).map(({id, description, progress, target, tier}) => {
                    const goalDone = progress >= target
                    const tierColor = tierColorChange(tier ?? "")
                    return (
                        <div key={id} className="flex items-center flex-row space-x-2 mb-3">
                            <div className="flex items-center flex-row space-x-2 ">
                                {goalDone ? <SquareCheckBig/> : <Square/>}
                                <p>{description}</p>
                            </div>
                            {tier && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${tierColor}`}>
                                {tier}
                            </span>
                            )}
                        </div>
                        
                    )}
                )}
            </div> 
        </>
    )
}