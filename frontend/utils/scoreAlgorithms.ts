

// Converts the mastery score (0-100) to an estimated SAT score (200-800) for each section
export function estimateSATSectionScore1(masteryScore: number): number {
    // Uses a sigmoid curve to approximate the non-linear SAT scaling, where mid-range scores (~500) are more densely distributed than extreme scores
    
    if (!masteryScore) return 200

    const m = masteryScore/100 // Normalizes the score (0-1)
    const k = 3 // controls how compressed the extremes are
    const sigmoid = 1 / (1 + Math.exp(-k * (m - 0.5)))

    // Scale the sigmoid score to SAT range
    const sigmoid_min = 1 / (1 + Math.exp(-k * (0 - 0.5)))  // sigmoid at mastery=0
    const sigmoid_max = 1 / (1 + Math.exp(-k * (1 - 0.5)))  // sigmoid at mastery=100
    const normalized = (sigmoid - sigmoid_min) / (sigmoid_max - sigmoid_min)

    // Approximates the SAT score 
    const raw_estimate = 200 + normalized*600
    return Math.round(raw_estimate/10)*10
}

export function estimateSATSectionScore2(masteryScore: number):number {
    if (!masteryScore) return 200

    const m = masteryScore / 100 // normalize 0-1
    const p = 1.3 // controls curve shape; >1 suppresses low scores more than high

    const normalized = Math.pow(m, p)
    const raw_estimate = 200 + normalized * 600
    return Math.round(raw_estimate / 10) * 10
}


export function estimateSATScore(readingMastery:number , mathMastery:number) : number {
    if (!readingMastery || !mathMastery) return 400

    const readingScore = estimateSATSectionScore2(readingMastery)
    const mathScore = estimateSATSectionScore2(mathMastery)

    return readingScore + mathScore
}
