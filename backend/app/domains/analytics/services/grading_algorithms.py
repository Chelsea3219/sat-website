# Import Python libraries and variables 
import pprint 
from sqlalchemy.orm import Session
from typing import List
from collections import defaultdict

from app.domains.errors.error_handler import handle_db_errors
from app.domains.analytics.schemas import IncomingPracticeSheet, MasteryScore, IncomingAnswerSheet, QuizResultsBreakdown
from app.domains.analytics.services.score_distribution import score_distribution
from app.domains.questions.services.topic import reading_topics, math_topics



def get_effective_mastery_score(persisted_score: float, session_answers: List[IncomingPracticeSheet]) -> float:
    # If the number of questions is less than 10, do not calculate the mastery_score
    if len(session_answers) < 10:
        return persisted_score
    
    # Format the mastery score
    overall_score = grade_practice_answer_sheet(session_answers)

    """
    Blend: weight session performance more as more data acculumates, capped at 70% influence. 
    Assumes the session eventually accumulates up to 30 answers before the session influence caps at 70%.
    If NUM_QUESTIONS = 30, the cap is reached after 33 full batches """
    session_weight = min(0.7, len(session_answers)/30)
    return persisted_score *(1 - session_weight) + overall_score["mastery_score"]*session_weight


def grade_practice_answer_sheet(session_answers: List[IncomingPracticeSheet]) -> MasteryScore:
    # Formats the mastery score
    overall_score = {"raw_score":0, "max_score":0, "mastery_score":0}
    for ans in session_answers:
        overall_score["raw_score"] += score_distribution(ans.difficulty, ans.is_correct)
        overall_score["max_score"] += score_distribution(ans.difficulty, True)
    overall_score["mastery_score"] = 100*overall_score["raw_score"] / overall_score["max_score"] if overall_score["mastery_score"] > 0 else 0

    return MasteryScore(**overall_score)


def grade_quiz_answer_sheet(section: str, answer_sheet: List[IncomingAnswerSheet]) -> QuizResultsBreakdown: 
    # Determine the parameters 
    topics = reading_topics if section == "reading" else math_topics
    section_mastery = {"raw_score": 0, "max_score": 0, "mastery_score": 0}
    topics_mastery = {t : {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in topics}
    all_subtopic_mastery = []

    # Group the student's answers by their topic and subtopic
    grouped = defaultdict(list)
    subtopics_by_topic = defaultdict(set) # Topic -->> list of subtopics lookup
    for ans in answer_sheet:
        for subtopic in ans.subtopic:
            grouped[(ans.topic, subtopic)].append(ans)
            subtopics_by_topic[ans.topic].add(subtopic)

    # Build the subtopic and topic mastery
    for t in topics:
        for subtopic in subtopics_by_topic.get(t, []):
            subtopic_answers = grouped[(t, subtopic)]
            time_elapsed = []
            # Initialize the subtopic mastery score 
            subtopic_mastery = {
                "section": section, 
                "topic": t, 
                "subtopic": subtopic, 
                "mastery_score": {"raw_score": 0, "max_score": 0, "mastery_score": 0}, 
                "questions_answered": {"num_questions": 0, "num_incorrect": 0}, 
                "avg_time_elapsed":0
            }
            for ans in subtopic_answers:
                time_elapsed.append(ans.time_elapsed)
                subtopic_mastery["mastery_score"]["raw_score"] += score_distribution(ans.difficulty, ans.is_correct)
                subtopic_mastery["mastery_score"]["max_score"]+= score_distribution(ans.difficulty, True)
                subtopic_mastery["questions_answered"]["num_questions"] += 1

                if not ans.is_correct:
                    subtopic_mastery["questions_answered"]["num_incorrect"] += 1
            subtopic_mastery["avg_time_elapsed"] = round( sum(time_elapsed) / len(time_elapsed) if len(time_elapsed) > 0 else 0)
            max_score = subtopic_mastery["mastery_score"]["max_score"]
            subtopic_mastery["mastery_score"]["mastery_score"] = round(
                100 * subtopic_mastery["mastery_score"]["raw_score"] / max_score if max_score > 0 else 0
            )
            subtopic_mastery["status"] = determine_status( subtopic_mastery["mastery_score"]["mastery_score"] )
            all_subtopic_mastery.append(subtopic_mastery)

            # Build the topic mastery
            topics_mastery[t]["raw_score"] += subtopic_mastery["mastery_score"]["raw_score"]
            topics_mastery[t]["max_score"] += subtopic_mastery["mastery_score"]["max_score"]
        topic_max_score = topics_mastery[t]["max_score"]
        topics_mastery[t]["mastery_score"] = round(
            100 * topics_mastery[t]["raw_score"] / topic_max_score if topic_max_score > 0 else 0
        )

    # Calculate the section mastery
    for t,score in topics_mastery.items():
        section_mastery["raw_score"] += score["raw_score"]
        section_mastery["max_score"] += score["max_score"]
    section_mastery["mastery_score"] = round( 100 * section_mastery["raw_score"] / section_mastery["max_score"] if section_mastery["max_score"] > 0 else 0)
        
    # Format results
    results = {
        "section_mastery": section_mastery, 
        "topic_mastery": topics_mastery, 
        "subtopic_mastery": all_subtopic_mastery
    }
    return QuizResultsBreakdown(**results)




# Determine student's progress status based on mastery score ------------------------------------------------------------
REVIEWED_THRESHOLD = 50
MASTERED_THRESHOLD = 90
def determine_status(mastery_score: float) -> str:
    if mastery_score < REVIEWED_THRESHOLD:
        status = "needs_review"
    elif mastery_score < MASTERED_THRESHOLD:
        status = "improving"
    else:
        status = "mastered"
    return status