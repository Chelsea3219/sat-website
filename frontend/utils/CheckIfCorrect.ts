import { Question } from "@/types/questions";

export const checkIfCorrect = (answer: string, question: Question): boolean => {
    const rawKey = question.answer_key;
    const normalized = answer.trim().toLowerCase();

    {/* 
        console.log("ANSWER DEBUG:", {
        answer,
        rawKey,
        keyType: typeof rawKey,
        isArray: Array.isArray(rawKey),
        isCorrect
    });
    */}

    // Multiple choice
    if (question.question_type === "multiple choice") {
        const isCorrect = normalized === String(rawKey).trim().toLowerCase();
        return isCorrect;
    }

    // Convert JSON string → array if necessary
    let keys: string[];

    if (Array.isArray(rawKey)) {
        keys = rawKey.map(String);
    } else if (typeof rawKey === "string") {
        try {
            const parsed = JSON.parse(rawKey);

            if (Array.isArray(parsed)) {
                keys = parsed.map(String);
            } else {
                keys = [rawKey];
            }
        } catch {
            keys = [rawKey];
        }
    } else {
        keys = [String(rawKey)];
    }

    const isCorrect = keys.some(
        key => normalized === key.trim().toLowerCase()
    )

    return isCorrect;
};