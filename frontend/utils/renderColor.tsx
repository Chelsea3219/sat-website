// const base = "circleWrapper font-bold text-3xl"

export const colorChange = (newScore: number, oldScore:number, base=""): string => {
        const change = newScore - oldScore
        if (change < 0) {
            return `${base} text-red-500`
        } else if (change > 0) {
            return `${base} text-green-500`
        } else {
            return ""
        }
    }
    


export const tierColorChange = (tier: string): string => {
    if (tier === null) return ""

    const base = "text-xs font-semibold"
    if (tier === "bronze") {
        return `${base} bg-[#F6E3D3] text-[#7C4A1E]`
    } else if (tier === "silver") {
        return `${base} bg-[#E8ECF1] text-[#475569]`
    } else {
        return `${base} bg-[#FCEFC7] text-[#7A5A00]`
    }
}