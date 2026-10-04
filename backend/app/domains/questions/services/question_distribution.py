# Import Python libraries and files 
from app.domains.questions.services.topic import all_topics, reading_topics, math_topics

# Questions Distribution based on difficulty -------------------------------------------------------------------------------------------
question_distribution = {
    "beginner": {"easy": 0.70, "medium": 0.20, "hard": 0.10},
    "intermediate": {"easy": 0.30, "medium": 0.50, "hard": 0.20},
    "advanced": {"easy": 0.10, "medium": 0.50, "hard": 0.40}
}



# Question Distrubution based on topic ------------------------------------------------------------------------------------------------
math_questions_per_topic = {
    "algebra": 8,
    "advanced math": 7,
    "problem solving & data analysis": 3,
    "geometry & trigonometry": 4
}
reading_questions_per_topic = {
    "information & ideas": 15,
    "craft & structure": 14,
    "expression of ideas": 15,
    "standard english conventions": 10
}



# Checks to see how the questions are allocated based on section and difficulty ------------------------------------------------------------
def check_questions_distribution(questions):

    # Intialize the parameters
    topic_count = {topic:0 for topic in all_topics}
    difficulty_count = {diff: {"reading": 0, "math": 0} for diff in ["easy", "medium", "hard"]}
    question_spread = topic_count | difficulty_count

    for topic in all_topics:
        question_spread[topic] = len([q for q in questions if q.topic == topic])

    for difficulty in ["easy", "medium", "hard"]:
        question_spread[difficulty] = len([q for q in questions if q.difficulty == difficulty])

    return question_spread