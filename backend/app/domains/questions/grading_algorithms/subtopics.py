# Import Python libraries and variables 
from app.domains.questions.helpers import determine_status


def build_subtopic_record(clerk_id, section, sub, stats) -> dict:
    mastery_score = stats["mastery_score"]

    # Format the subtopic_mastery record 
    record = {
        "clerk_id": clerk_id, 
        "section" : section,
        "subtopic": sub,
        "mastery_score" : {
            "raw_score": stats["raw_score"], 
            "max_score": stats["max_score"], 
            "mastery_score": stats["mastery_score"],
        }, 
        "questions_answered": {
            "num_incorrect": stats["num_incorrect"], 
            "num_questions": stats["num_questions"],
        }, 
        "avg_time_elapsed": round( sum(stats["time_elapsed"]) / stats["num_questions"] if stats["num_questions"] else 0, 0 ), 
        "status": determine_status(mastery_score=mastery_score)
    }
    return record


def update_subtopic_mastery(existing:dict, mew:dict) -> dict: 

    return