import { IncomingGradedAnswerSheet } from "@/types/mastery-score" // adjust import path as needed

export const sampleQuizResults: IncomingGradedAnswerSheet = {
    section_mastery: {
        max_score: 10,
        raw_score: 7,
        mastery_score: 70
    },
    topic_mastery: {
        "Algebra": {
            max_score: 4,
            raw_score: 3,
            mastery_score: 75
        },
        "Advanced Math": {
            max_score: 3,
            raw_score: 2,
            mastery_score: 80
        },
        
        "Problem Solving & Data Analysis": {
            max_score: 3,
            raw_score: 2,
            mastery_score: 67
        }, 
        "Geometry & Trigonometry": {
            max_score: 3,
            raw_score: 2,
            mastery_score: 67
        },
    },
    subtopics_mastery: [
        {
            subtopic: "Linear Equations",
            mastery_score: {
                max_score: 2,
                raw_score: 2,
                mastery_score: 100
            },
            questions_answered: {
                num_incorrect: 0,
                num_questions: 2
            },
            avg_time_elapsed: 45,
            status: "mastered"
        },
        {
            subtopic: "Quadratic Equations",
            mastery_score: {
                max_score: 2,
                raw_score: 1,
                mastery_score: 50
            },
            questions_answered: {
                num_incorrect: 1,
                num_questions: 2
            },
            avg_time_elapsed: 78,
            status: "needs_review"
        },
        {
            subtopic: "Triangle Properties",
            mastery_score: {
                max_score: 3,
                raw_score: 2,
                mastery_score: 70
            },
            questions_answered: {
                num_incorrect: 1,
                num_questions: 3
            },
            avg_time_elapsed: 62,
            status: "in_progress"
        },
        {
            subtopic: "Data Interpretation",
            mastery_score: {
                max_score: 3,
                raw_score: 2,
                mastery_score: 67
            },
            questions_answered: {
                num_incorrect: 1,
                num_questions: 3
            },
            avg_time_elapsed: 55,
            status: "in_progress"
        }
    ],
    gold_analytics: {
        reading_mastery: {
            max_score: 100,
            raw_score: 82,
            mastery_score: 82
        },
        math_mastery: {
            max_score: 100,
            raw_score: 71,
            mastery_score: 71
        },
        reading_topics_mastery: {
            "Vocabulary": {
                max_score: 20,
                raw_score: 17,
                mastery_score: 0.85
            },
            "Reading Comprehension": {
                max_score: 20,
                raw_score: 16,
                mastery_score: 0.8
            }
        },
        math_topics_mastery: {
            "Algebra": {
                max_score: 20,
                raw_score: 15,
                mastery_score: 0.75
            },
            "Geometry": {
                max_score: 20,
                raw_score: 13,
                mastery_score: 0.65
            }
        }
    }
}