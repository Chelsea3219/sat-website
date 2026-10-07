import { ArrowRight } from "lucide-react"

type CardProps = {
    text: string 
}


export default function GlowButton({ text}: CardProps) {

    return (
        <div className="flex items-center justify-center">
            <button
                className="
                    relative px-6 py-1
                    bg-whiteblueOne text-white font-semibold rounded-lg border-2 border-primaryOne
                    transition-all duration-300 hover:shadow-[0_0_20px_10px_rgba(145,137,235,0.6)] active:scale-95 active:shadow-[0_0_10px_5px_rgba(145,137,235,0.4)] group"
            >
            <span className="flex items-center space-x-2">
                <ArrowRight className="text-primary w-8 h-6 group-hover:scale-120 transition-colors duration-300" strokeWidth={3}/>
                <span className="text-primary ">{text}</span>
            </span>
            <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-white/50 to-purple-500/30"
            ></span>
            </button>

        </div>
    )
}