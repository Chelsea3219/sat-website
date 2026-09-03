import random 
from collections import defaultdict
from app.domains.questions.helpers import check_questions_distribution, question_distribution, math_questions_per_topic, reading_questions_per_topic, mastery_score_to_difficulty
import pprint


def fetch_assessment_questions(section, proficiency, questions):
    # Initializes the question selection parameters
    questions_per_difficulty = question_distribution[proficiency]
    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    # Group questions by topic and difficulty
    grouped = defaultdict(list)
    for q in questions:
        grouped[(q.topic, q.difficulty)].append(q)

    def random_sample(pool, target):
        return random.sample(pool, min(target, len(pool)))

    # Selects the questions
    selected_questions = []
    for topic, topic_count in questions_per_topic.items():
        easy_target = round(topic_count * questions_per_difficulty["easy"])
        medium_target = round(topic_count * questions_per_difficulty["medium"])
        hard_target = topic_count - easy_target - medium_target

        selected_questions.extend(random_sample(grouped[(topic, "easy")], easy_target))
        selected_questions.extend(random_sample(grouped[(topic, "medium")], medium_target))
        selected_questions.extend(random_sample(grouped[(topic, "hard")], hard_target))

    # Shuffles the selected questions
    random.shuffle(selected_questions)

    # Checks the distribution of questions
    distribution = check_questions_distribution(selected_questions)
    pprint.pprint(distribution)

    return selected_questions



def fetch_adaptive_questions(section, questions, weak_subtopics):
    # weak_subtopics = {[subtopic_1, mastery_score], [subtopic_2, mastery_score]}
    
    def random_sample(pool, target):
        return random.sample(pool, min(target, len(pool)))
    
    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    # Groups the questions by topic and subtopic 
    grouped = defaultdict(list)
    for q in questions:
        for sub in q.subtopic:
            grouped[(q.topic, sub, q.difficulty)].append(q)

    # Selects the questions based on topics
    selected_questions = []
    for topic, topic_count in questions_per_topic.items():
        adaptive_topic_count = round(0.60*topic_count) # The adaptive questions will consits 60% of the quiz questions

        seen_candidates = set()
        subtopic_questions = []
        # Selects the questions based on weak_subtopics
        for subtopic, mastery_score in weak_subtopics:
            difficulty = mastery_score_to_difficulty(mastery_score)
            for q in grouped[(topic, subtopic, difficulty)]:
                if q.question_id not in seen_candidates:
                    seen_candidates.add(q.question_id)
                    subtopic_questions.append(q)

        # Randomly selects adaptive questions
        sampled_adaptive = random_sample(subtopic_questions, adaptive_topic_count)
        selected_questions.extend(sampled_adaptive)
        selected_ids = {q.question_id for q in sampled_adaptive}

        # Selects the rest of the questions
        nonadaptive_topic_count = topic_count - len(sampled_adaptive)
        nonadaptive_questions = [q for q in questions if q.topic == topic and q.question_id not in selected_ids]
        selected_questions.extend(random_sample(nonadaptive_questions, nonadaptive_topic_count))

    # Randomly shuffles questions 
    random.shuffle(selected_questions)

    # Checks the distribution of questions
    distribution = check_questions_distribution(selected_questions)
    pprint.pprint(distribution)

    return selected_questions
