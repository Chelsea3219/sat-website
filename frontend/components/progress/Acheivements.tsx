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

        <div className="">
            {/* Title */}
            <div className="flex flex-row space-x-2 items-center mb-2">
                <Trophy style={{strokeWidth:2}} className="text-accent w-6 h-6"/>
                <p className={`text-accent ${cardTitleStyle}`}>Achievements</p>
            </div>

            {/* Achievements  */}
            {/* TODO add more acheivements */}
            <div className = "grid grid-cols-1 gap-y-2">
                {(achievements ?? []).map(({id, description, progress, target, tier}) => {
                    const goalDone = progress >= target
                    const tierColor = tierColorChange(tier ?? "")
                    return (
                        <div key={id} className="flex items-center gap-2 min-w-0">
                            <div className="flex items-center flex-row space-x-2 ml-8">
                                {goalDone
                                    ? <SquareCheckBig className="w-4 h-4 shrink-0" />
                                    : <Square className="w-4 h-4 shrink-0" />
                                }
                                <p>{description}</p>
                                {tier && (
                                    <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${tierColor}`}>
                                        {tier}
                                    </span>
                                )}
                            </div>
                            
                        </div>
                        
                    )}
                )}
            </div> 
        </div>
    )
}