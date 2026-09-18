from pydantic import BaseModel
from app.domains.analytics.schemas import BaseSubtopicMastery

def to_plain(value):
    """Recursively convert Pydantic models (and dicts of them) into plain JSON-serializable dicts."""
    if isinstance(value, BaseModel):
        return value.model_dump()
    if isinstance(value, dict):
        return {k: to_plain(v) for k, v in value.items()}
    return value

def to_dict(obj):
    if isinstance(obj, BaseSubtopicMastery):
        return obj.model_dump()
    if isinstance(obj, dict):
        return obj
    # ORM object — pull fields manually
    return {
        "session_id": obj.session_id,
        "clerk_id": obj.clerk_id,
        "section": obj.section,
        "topic": obj.topic,
        "subtopic": obj.subtopic,
        "mastery_score": obj.mastery_score,          # already a dict from JSONB
        "questions_answered": obj.questions_answered, # already a dict from JSONB
        "avg_time_elapsed": obj.avg_time_elapsed,
        "status": obj.status,
    }