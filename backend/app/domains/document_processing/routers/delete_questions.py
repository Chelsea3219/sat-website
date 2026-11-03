# Import Python libraries and files 
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
import logging

from app.core.database import get_db
from app.core.auth import require_admin
from app.core.logging_config import setup_logging

from app.domains.errors.error_handler import handle_db_errors
from app.domains.questions.models import BronzeQuestions
from app.domains.answer_explanations.models import SilverHintsAnswerExplanations


setup_logging()
logger = logging.getLogger("delete question")
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"], dependencies=[Depends(require_admin)])


@router.delete("/delete-questions/{question_id}")
def delete_questions(question_id: str, db=Depends(get_db)):
    with handle_db_errors(db, "deleting question"):

        # Fetches the question and answer_explanation
        bronze_question = db.query(BronzeQuestions).filter(BronzeQuestions.question_id == question_id).first()
        answer_explanation = db.query(SilverHintsAnswerExplanations).filter(SilverHintsAnswerExplanations.question_id == question_id).first()

        if not bronze_question:
            logger.info("Question not found or is already deleted", question_id)
            return {"message": "Question already deleted"}

        # Delete the question and answer explanation
        db.delete(bronze_question)
        if answer_explanation: db.delete(answer_explanation)
        db.commit()
        return {"message": "Question deleted successfully"}