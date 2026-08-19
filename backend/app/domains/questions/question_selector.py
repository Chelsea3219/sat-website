import random 
from app.domains.questions.helpers import check_questions_distribution

# Questions Distribution based on difficulty 
question_distribution = {
    "beginner": {"easy": 0.70, "medium": 0.20, "hard": 0.10},
    "intermediate": {"easy": 0.30, "medium": 0.50, "hard": 0.20},
    "advanced": {"easy": 0.10, "medium": 0.50, "hard": 0.40}
}

math_questions_per_topic = {
    "algebra": 15,
    "advanced math": 15,
    "problem solving & data analysis": 7,
    "geometry & trigonometry": 7
}

reading_questions_per_topic = {

}


def fetch_quiz_questions(topic, proficiency, questions):

    selected_questions = []
    questions_per_difficulty = question_distribution[proficiency]

    if topic == "math":
        questions_per_topic = math_questions_per_topic
    else:
        questions_per_topic = reading_questions_per_topic

    for t, t_count in questions_per_topic.item():
        topic_questions = [q for q in questions if q.topic == t]

        # Organizes questions based on difficulty
        easy_pool = [q for q in topic_questions if q.difficulty == "easy"]
        medium_pool = [q for q in topic_questions if q.difficulty == "medium"]
        hard_pool = [q for q in topic_questions if q.difficulty == "hard"]

        # Determines the number of questions per difficulty
        easy_target = round(t_count * questions_per_difficulty["easy"])
        medium_target = round(t_count * questions_per_difficulty["medium"])
        hard_target = t_count - easy_target - medium_target

        # Fetches a random list of questions per difficulty
        selected_questions.extend( random.sample(easy_pool, easy_target))
        selected_questions.extend( random.sample(medium_pool, medium_target))
        selected_questions.extend( random.sample(hard_pool, hard_target))

    # Shuffles the selected questions
    random.shuffle(selected_questions)

    # Checks the distribution of questions
    distribution = check_questions_distribution(selected_questions)
    #print(distribution)

    return selected_questions
