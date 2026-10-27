from sqlalchemy import update, func, type_coerce
#type_coerce(value, column.type) tells SQLAlchemy to treat the value as that column’s type. JSON columns serialize the dict, and every other column behaves the same as before.
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
    data = explanation.model_dump(exclude={"question_id"}, exclude_none=True)
    table = SilverHintsAnswerExplanations

    db.flush()
    try:
        # Updates the explanation status in the silver questions table, from generating to pending_review
        query = update(SilverQuestions).where(SilverQuestions.question_id == question_id).values(explanation_status ="done")
        db.execute(query)

        # Update the existing explanation (e.g. pine sat questions); insert if none exists
        result = db.execute(
            update(table)
            .where(table.question_id == question_id)
            .values({
                getattr(table, col): func.coalesce(
                    getattr(table, col),
                    type_coerce(value, getattr(table, col).type),
                )
                for col, value in data.items()
            })
        )

        # Saves the results in the SilverHintsAnswerExplanations table 
        if result.rowcount == 0:
            db.add(table(question_id=question_id, **data))
        db.commit()
    except Exception:
        db.rollback()
        raise 