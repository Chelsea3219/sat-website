# Import Python libraries and variables 
import pprint 
from app.domains.questions.helpers import reading_topics, math_topics


def build_user_analytics(section, section_mastery, topics_mastery):
    # Organizes the section and topics mastery score 
    reading_mastery = math_mastery = {"raw_score": 0, "max_score": 0, "mastery_score": 0} 
    reading_topics_mastery = {t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in reading_topics}
    math_topics_mastery = {t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in math_topics}
    
    if section == "reading":
        reading_mastery = section_mastery
        reading_topics_mastery = topics_mastery
    else: 
        math_mastery = section_mastery
        math_topics_mastery = topics_mastery

    return {
        "reading_mastery": reading_mastery, 
        "math_mastery": math_mastery, 
        "reading_topics_mastery": reading_topics_mastery, 
        "math_topics_mastery": math_topics_mastery
    }


def merge_score_dict(existing: dict, recent: dict) -> dict:
    raw_score = existing.get("raw_score", 0) + recent.get("raw_score", 0)
    max_score = existing.get("max_score", 0) + recent.get("max_score", 0)
    mastery_score = round((raw_score / max_score) * 100, 0) if max_score > 0 else 0
    return {"raw_score": raw_score, "max_score": max_score, "mastery_score": mastery_score}


def update_analytics(existing, recent):
    results = {}
    flat_cols = ["reading_mastery", "math_mastery"]
    nested_cols = ["reading_topics_mastery", "math_topics_mastery"]

    for col in flat_cols:
        existing_val = existing.get(col) or {"raw_score": 0, "max_score": 0, "mastery_score": 0}
        recent_val = recent.get(col) or {"raw_score": 0, "max_score": 0, "mastery_score": 0}
        results[col] = merge_score_dict(existing_val, recent_val)

    for col in nested_cols:
        existing_topics = existing.get(col) or {}
        recent_topics = recent.get(col) or {}
        all_topics = set(existing_topics) | set(recent_topics)
        results[col] = {
            topic: merge_score_dict(
                existing_topics.get(topic) or {"raw_score": 0, "max_score": 0, "mastery_score": 0},
                recent_topics.get(topic) or {"raw_score": 0, "max_score": 0, "mastery_score": 0},
            )
            for topic in all_topics
        }
    return results