# Import Python libraries and files 
from typing import Dict, List
from app.domains.analytics.schemas import MasteryScore, IncomingPracticeSheet, BaseSubtopicMastery, IncomingGoldSubtopicMastery
from app.domains.analytics.services.grading_algorithms import determine_status
from app.domains.analytics.services.sqlalchemy_tools import to_dict


# Build subtopic_mastery to add to the silver.subtopic_mastery table
def build_subtopic_mastery(
    section: str, 
    topic: str, 
    subtopic: str, 
    mastery_score: MasteryScore,
    answer_sheet: List[IncomingPracticeSheet]
) -> dict:
    # Calculate the parameters 
    num_questions = 0 
    num_incorrect = 0 
    time_elapsed = []
    for ans in answer_sheet:
        num_questions += 1
        time_elapsed.append(ans.time_elapsed)
        if not ans.is_correct:
            num_incorrect += 1

    # Format the subtopic_record
    silver_subtopic_mastery = {
        "section": section,
        "topic" : topic,
        "subtopic": subtopic, 
        "mastery_score": mastery_score.model_dump(), 
        "questions_answered": {
            "num_incorrect": num_incorrect, 
            "num_questions": num_questions
        }, 
        "avg_time_elapsed": round(sum(time_elapsed) / len(time_elapsed)), 
        "status": determine_status(mastery_score.mastery_score), 
    }
    return silver_subtopic_mastery


# Update the previous subtopic analytics with the new subtopic analytics
def update_subtopic_mastery_old(new:dict, previous) -> dict:

    # Converts previous as a Mastery Score
    prev = previous if isinstance(previous, BaseSubtopicMastery) else BaseSubtopicMastery(**previous)

    # Updates the question breakdown
    num_questions = new.questions_answered.num_questions + prev.questions_answered.num_questions
    num_incorrect = new.questions_answered.num_incorrect + prev.questions_answered.num_incorrect

    # Update the score breakdown 
    mastery_score = {
        "raw_score": new.mastery_score.raw_score + prev.mastery_score.raw_score,
        "max_score": new.mastery_score.max_score + prev.mastery_score.max_score, 
    }
    mastery_score["mastery_score"] = round( 100 * (mastery_score["raw_score"] / mastery_score["max_score"] if mastery_score["max_score"] > 0 else 0 ))

    # Update the avg_time_elapsed
    prev_sum_time = prev.avg_time_elapsed * prev.questions_answered.num_questions
    new_sum_time = new.avg_time_elapsed * new.questions_answered.num_questions
    avg_time_elapsed = round( (prev_sum_time + new_sum_time) / num_questions )

    # Format the updated subtopic mastery 
    subtopic_mastery = {
        "section": new.section, 
        "topic": new.topic,
        "subtopic": new.subtopic,
        "mastery_score": mastery_score, 
        "questions_answered": {
            "num_questions": num_questions,
            "num_incorrect": num_incorrect
        },
        "avg_time_elapsed": avg_time_elapsed,
        "status": determine_status(mastery_score["mastery_score"])
    }

    return subtopic_mastery

def update_subtopic_mastery(new, previous):
    new_d = to_dict(new)
    prev_d = to_dict(previous)

    num_questions = new_d["questions_answered"]["num_questions"] + prev_d["questions_answered"]["num_questions"]
    num_incorrect = new_d["questions_answered"]["num_incorrect"] + prev_d["questions_answered"]["num_incorrect"]

    raw_score = new_d["mastery_score"]["raw_score"] + prev_d["mastery_score"]["raw_score"]
    max_score = new_d["mastery_score"]["max_score"] + prev_d["mastery_score"]["max_score"]
    mastery_score = round(100 * (raw_score / max_score) if max_score > 0 else 0)

    prev_sum_time = prev_d["avg_time_elapsed"] * prev_d["questions_answered"]["num_questions"]
    new_sum_time = new_d["avg_time_elapsed"] * new_d["questions_answered"]["num_questions"]
    avg_time_elapsed = round((prev_sum_time + new_sum_time) / num_questions)

    return {
        "section": new_d["section"],
        "topic": new_d["topic"],
        "subtopic": new_d["subtopic"],
        "mastery_score": {"raw_score": raw_score, "max_score": max_score, "mastery_score": mastery_score},
        "questions_answered": {"num_questions": num_questions, "num_incorrect": num_incorrect},
        "avg_time_elapsed": avg_time_elapsed,
        "status": determine_status(mastery_score),
    }