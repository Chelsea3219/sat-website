# Import Python libraries and files 
import pprint 
from typing import Dict, Optional, List
from app.domains.questions.services.topic import reading_topics, math_topics
from app.domains.analytics.schemas import MasteryScore, IncomingGoldAnalytics

# default-factory function that builds the zeroed placeholder structure,
def default_section_mastery_block() -> dict:
    return {"raw_score": 0, "max_score": 0, "mastery_score": 0}
def default_topic_mastery_block(topics: list[str]) -> dict:
    return {
        t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in topics
    }


# Combine new and previous masteryScore
def combine_mastery(previous: dict, new: dict) -> dict:
    raw_score = previous["raw_score"] + new["raw_score"]
    max_score = previous["max_score"] + new["max_score"]
    mastery_score = round(100 * (raw_score / max_score) if max_score > 0 else 0)
    return {"raw_score": raw_score, "max_score": max_score, "mastery_score": mastery_score}


# Combine new and previous topics mastery score
def combine_topics_mastery(topics: List[str], previous: Dict[str, dict], new: Dict[str, dict]) -> Dict[str, dict]:
    combined = {}
    for t in topics:
        old_score = previous.get(t) or {"raw_score": 0, "max_score": 0, "mastery_score": 0}
        new_score = new.get(t) or {"raw_score": 0, "max_score": 0, "mastery_score": 0}
        combined[t] = combine_mastery(old_score, new_score)
    return combined

    
# Updated the previous_analytics with the new
def update_gold_analytics(
    section: str, 
    previous: IncomingGoldAnalytics, 
    new_section_mastery: MasteryScore, 
    new_topic_mastery: Dict[str, MasteryScore]
) -> dict:

    # Top-level normalization -->> converts into a plain python dict
    new_section_mastery = new_section_mastery.model_dump() if isinstance(new_section_mastery, MasteryScore) else new_section_mastery
    new_topic_mastery = {k: (v.model_dump() if isinstance(v, MasteryScore) else v) for k, v in new_topic_mastery.items()}

    # Guard against a new user
    if previous is None:
        updated_analytics = {
            "reading_mastery": new_section_mastery if section == "reading" else default_section_mastery_block(), 
            "reading_topics_mastery": new_topic_mastery if section == "reading" else default_topic_mastery_block(reading_topics),

            "math_mastery": new_section_mastery if section == "math" else default_section_mastery_block(),
            "math_topics_mastery": new_topic_mastery if section == "math" else default_topic_mastery_block(math_topics),
        }
    else:
        updated_analytics = {
            "reading_mastery": combine_mastery(previous.reading_mastery, new_section_mastery) if section == "reading" else previous.reading_mastery, 
            "reading_topics_mastery": combine_topics_mastery(reading_topics, previous.reading_topics_mastery, new_topic_mastery) if section == "reading" else previous.reading_topics_mastery,

            "math_mastery": combine_mastery(previous.math_mastery, new_section_mastery) if section == "math" else previous.math_mastery,
            "math_topics_mastery": combine_topics_mastery(math_topics, previous.math_topics_mastery, new_topic_mastery) if section == "math" else previous.math_topics_mastery,
        }
    pprint.pprint(updated_analytics)
    
    return updated_analytics

