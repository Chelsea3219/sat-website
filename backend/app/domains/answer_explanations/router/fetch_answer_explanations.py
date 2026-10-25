# Import Python libraries and files 
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from sqlalchemy import select 

from app.core.database import get_db
from app.core.config import settings
from app.domains.errors.error_handler import handle_db_errors

from app.domains.answer_explanations.models import SilverHintsAnswerExplanations
from app.domains.answer_explanations.schemas import OutgoingAnswerExplanations

from app.domains.questions.services.question_selection import practice_question_selection, quiz_question_selection, quiz_assessment_selection
from app.domains.analytics.services.grading_algorithms import get_effective_mastery_score
from app.domains.students.services.fetch_student_info import fetch_student_info, fetch_subtopic_mastery, fetch_test_scores, fetch_gold_quiz_analytics

router = APIRouter(prefix="/api/answer_explanations", tags=["answer_explanations"])


@router.get("/fetch-answer-explanations")
def fetch_answer_explanations(question_ids:List[str], db=Depends(get_db)) -> List[OutgoingAnswerExplanations]:

    with handle_db_errors(db, "fetching answer explanations based on a list of questions ids"):
        statement = select(SilverHintsAnswerExplanations).where(SilverHintsAnswerExplanations.question_id.in_(question_ids))
        results = db.excute(statement).scalars().all()
        return results 