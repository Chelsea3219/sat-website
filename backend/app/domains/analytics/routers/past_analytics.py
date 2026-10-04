# Import Python libraries and files
import pprint
from fastapi import APIRouter, Depends
from typing import List

from app.core.database import get_db
from app.domains.analytics.models import SilverAnalytics, GoldSubtopicMastery
from app.domains.analytics.schemas import  PastQuizAnalytics, IncomingGoldSubtopicMastery
from app.domains.errors.error_handler import handle_db_errors

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/past-quiz-analytics/{clerk_id}")
def past_quiz_analytics(clerk_id: str, db=Depends(get_db)) -> PastQuizAnalytics:
    with handle_db_errors(db, "retrieving past quiz analytics from silver schema"):
        past_ten_quizzes = db.query(SilverAnalytics).filter(SilverAnalytics.clerk_id == clerk_id).order_by(SilverAnalytics.completed_at.desc()).limit(10).all()
        num_quizzes = db.query(SilverAnalytics).filter(SilverAnalytics.clerk_id == clerk_id).count()
        results = {
            "past_quizzes": past_ten_quizzes, 
            "num_quizzes": num_quizzes
        }
    return results


@router.get("past-subtopic-analytics/{clerk_id}/{subtopic}")
def past_subtopic_analytics(clerk_id: str, subtopic: str, db=Depends(get_db)) -> IncomingGoldSubtopicMastery | None:
    with handle_db_errors(db, "fetching the current analytics for the selected subtopic"):
        results = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id == clerk_id, GoldSubtopicMastery.subtopic == subtopic).first()
        return results