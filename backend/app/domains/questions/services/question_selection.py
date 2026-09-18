# Import Python libraries and files
import pprint
from typing import List
from collections import defaultdict
import random

from app.domains.questions.schemas import IncomingQuestions
from app.domains.analytics.schemas import IncomingGoldSubtopicMastery
from app.domains.questions.services.weighted_sampling import weighted_sampling_without_replacement
from app.domains.questions.services.difficulty_to_mastery_score import mastery_score_to_difficulty, difficulty_weight, difficulties_to_try
from app.domains.questions.services.question_distribution import math_questions_per_topic, reading_questions_per_topic, check_questions_distribution, question_distribution


# Function to randomly select n questions
def random_sample(pool, target):
    return random.sample(pool, min(target, len(pool)))



# Function to select practice questions based on the student's mastery score
def practice_question_selection(
        questions: List[IncomingQuestions], 
        mastery_score: int
) -> List[IncomingQuestions]:
    """
    Most of the questions (80%) are pulled from a loaded deck that's stacked in favor of the student's
    actual skill level, so they get realistic, appropriately challenging practice. The remaining 
    are just grabbed at random from whatever's left. 
    """
    
    # Declare the variables
    NUM_QUESTIONS = 10 #TODO change it to 7/8 if the avg session length is short
    PERCENT_OF_WEAK_SUBTOPICS = 80/100
    adaptive_question_count = round(PERCENT_OF_WEAK_SUBTOPICS*NUM_QUESTIONS)
    nonadaptive_question_count = NUM_QUESTIONS - adaptive_question_count

    # Determine the user's difficulty level
    user_difficulty = mastery_score_to_difficulty(mastery_score)

    # Determine weights based on difficulty
    weights = [difficulty_weight(q.difficulty, user_difficulty) for q in questions] #lower mastery --> higher weights

    # Randomly chooses questions
    adaptive_questions = weighted_sampling_without_replacement(questions, weights, adaptive_question_count)
    selected_ids = {q.question_id for q in adaptive_questions}
    remaining_questions = [q for q in questions if q.question_id not in selected_ids]
    nonadaptive_questions = random_sample(remaining_questions, nonadaptive_question_count)

    # Adds questions 
    adaptive_questions.extend(nonadaptive_questions)
    #pprint.pprint(adaptive_questions)

    # Check Question Distributions
    question_distribution = {"easy": 0, "medium": 0, "hard":0}
    for diff in ["easy", "medium", "hard"]:
        question_distribution[diff] = len([q for q in adaptive_questions if q.difficulty == diff])
    #print("mastery_score ==>> ", mastery_score)
    #pprint.pprint(question_distribution)

    return adaptive_questions


# Function select quiz questions based on the student's subtopic mastery score
def quiz_question_selection(
        questions: List[IncomingQuestions], 
        section: str,
        subtopic_mastery: List[IncomingGoldSubtopicMastery]
):
    # Declare questions per topic
    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    # Assign the subtopics their difficulty level and weight
    subtopic_breakdown = [
        {   "topic" : sub.topic,
            "subtopic": sub.subtopic, 
            "mastery_score": sub.mastery_score["mastery_score"], 
            "difficulty_level": mastery_score_to_difficulty( sub.mastery_score["mastery_score"] ),
            "weight": round(max(1, 100 - sub.mastery_score["mastery_score"]), 0) # lower mastery -->> higher weights
         }
        for sub in subtopic_mastery
    ]

    # Groups the questions by topic and subtopic and difficulty (e.g. give me all the algebra questions tagged 'slope at difficulty medium into an O(1) dict lookup )
    grouped = defaultdict(list)
    for q in questions:
        for subtopic in q.subtopic:
            grouped[(q.topic, subtopic, q.difficulty)].append(q)


    # Select Questions based on topic
    selected_questions = []
    PERCENT_ADAPTIVE = 60/100
    for topic, topic_count in questions_per_topic.items():
        adaptive_topic_count = round(PERCENT_ADAPTIVE*topic_count)
        candidates = []
        weights = []
        seen_candidates = set()

        topic_subtopics = [sub for sub in subtopic_breakdown if sub["topic"] == topic]

        for sub in topic_subtopics:
            allowed_diffs = set(difficulties_to_try( sub["difficulty_level"]) )
            for diff in allowed_diffs:
                for q in grouped.get((topic, sub["subtopic"], diff), []):
                    if q.question_id not in seen_candidates:
                        seen_candidates.add(q.question_id)
                        candidates.append(q)
                        weights.append(sub["weight"])

        # Randomly selects adaptive questions
        sampled_adaptive = weighted_sampling_without_replacement(candidates, weights, adaptive_topic_count)
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


# Function select assessment questions based on the student's proficiency
def quiz_assessment_selection(section:str , proficiency:str, questions: List[IncomingQuestions]):
    # Initializes the question selection parameters
    questions_per_difficulty = question_distribution[proficiency]
    questions_per_topic = math_questions_per_topic if section == "math" else reading_questions_per_topic

    # Group questions by topic and difficulty
    grouped = defaultdict(list)
    for q in questions:
        grouped[(q.topic, q.difficulty)].append(q)

    # Selects the questions
    selected_questions = []
    for topic, topic_count in questions_per_topic.items():
        easy_target = round(topic_count * questions_per_difficulty["easy"])
        medium_target = round(topic_count * questions_per_difficulty["medium"])
        hard_target = max(0, topic_count - easy_target - medium_target)

        easy_questions = random_sample(grouped[(topic, "easy")], easy_target)
        medium_questions = random_sample(grouped[(topic, "medium")], medium_target)
        hard_questions = random_sample(grouped[(topic, "hard")], hard_target)

        selected_ids = {q.question for q in (easy_questions + medium_questions + hard_questions)}
        shortfall = topic_count - len(selected_ids)

        if shortfall > 0:
            # backfills from whatever's left in this topic, regardless of difficulty
            leftover_pool = [q for q in (easy_questions + medium_questions + hard_questions) if q.question_id not in selected_ids]
            backfill = random_sample(leftover_pool, shortfall)
            selected_questions.extend(easy_questions + medium_questions + hard_questions + backfill)
        else:
            selected_questions.extend(easy_questions + medium_questions + hard_questions)

    # Shuffles the selected questions
    random.shuffle(selected_questions)

    # Checks the distribution of questions
    distribution = check_questions_distribution(selected_questions)
    pprint.pprint(distribution)

    return selected_questions