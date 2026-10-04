import { ReadingTopicsMastery, MathTopicsMastery, MasteryScore } from "@/types/students";
import { toTitleCase } from "./renderFormattedText";

export function topicBreakdown(
    topicsMastery: ReadingTopicsMastery | MathTopicsMastery | undefined,
    fallbackTopics: string[] = []
): Record<string, number> {
    if (!topicsMastery) {
        return Object.fromEntries(fallbackTopics.map(topic => [toTitleCase(topic), 0]))
    }

    return Object.fromEntries(
        Object.entries(topicsMastery).map(([topic, masteryScore]) => [
            toTitleCase(topic),
            (masteryScore as MasteryScore).mastery_score
        ])
    )
}

