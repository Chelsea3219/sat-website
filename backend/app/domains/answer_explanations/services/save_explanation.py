from sqlalchemy import select, insert, update
from sqlalchemy.orm import Session
from typing import List

from app.domains.questions.models import SilverQuestions
from app.domains.answer_explanations.schemas import OutgoingAnswerExplanations
from app.domains.answer_explanations.models import SilverHintsAnswerExplanations
from app.domains.errors.error_handler import handle_db_errors


def save_answer_explanation(db:Session, explanation: OutgoingAnswerExplanations):
    """Updates the SilverQuestion explanation_status and saves the answer explanation in the silver schema."""

    # Retrieves the question_id
    question_id = explanation.question_id

    # Updates the explanation status in the silver questions table, from generating to pending_review 
    query = update(SilverQuestions).where(SilverQuestions.question_id == question_id).values(explanation_status ="done")
    db.execute(query)

    # Saves the results in the SilverHintsAnswerExplanations table 
    db.add(SilverHintsAnswerExplanations(**explanation.model_dump()))
    db.commit()