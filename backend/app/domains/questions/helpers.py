# Checks to see how the questions are allocated based on section and difficulty
def check_questions_distribution(questions):
    all_topics = [
        "information & ideas", "craft & structure", "expression of ideas", "standard english conventions",
        "algebra", "advanced math", "problem solving & data analysis", "geometry & trigonometry"
    ]

    question_spread = {
        "information & ideas":0,
        "craft & structure":0,
        "expression of ideas":0,
        "standard english conventions":0,

        "algebra":0,
        "advanced math":0,
        "problem solving & data analysis":0,
        "geometry & trigonometry":0,

        "easy" : {"reading": 0, "math":0},
        "medium" : {"reading": 0, "math":0},
        "hard" : {"reading": 0, "math":0}
    }
    for topic in all_topics:
        question_spread[topic] = len([q for q in questions if q.topic == topic])

    for difficulty in ["easy", "medium", "hard"]:
        question_spread[difficulty] = len([q for q in questions if q.difficulty == difficulty])

    return question_spread