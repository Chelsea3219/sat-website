import random 
from app.domains.questions.helpers import check_questions_distribution, question_distribution, math_questions_per_topic, reading_questions_per_topic
import pprint


def fetch_assessment_questions(section, proficiency, questions):
    selected_questions = []
    questions_per_difficulty = question_distribution[proficiency]

    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    for t, t_count in questions_per_topic.items():
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
    pprint.pprint(distribution)

    return selected_questions



def fetch_adaptive_questions(section, proficiency, questions, weak_subtopics):
    print("GO BACK GO BACK GO BACK GO BACK GO BACK")

    selected_questions = []
    questions_per_difficulty = question_distribution[proficiency]

    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    for t, t_count in questions_per_topic.items():
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
    pprint.pprint(distribution)

    return selected_questions
