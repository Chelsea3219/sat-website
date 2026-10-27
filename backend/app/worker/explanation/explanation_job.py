import logging 
from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
import anthropic 

from app.core.database import SessionLocal
from app.core.logging_config import setup_logging
from app.domains.questions.models import SilverQuestions
from app.domains.answer_explanations.services.generate_answer_explanation import generate_answer_explanation
from app.domains.answer_explanations.services.save_explanation import save_answer_explanation
from app.domains.questions.utils import content_hash


setup_logging()
logger = logging.getLogger(__name__)

def _set_status(db, question_id, status):
    db.execute(update(SilverQuestions).where(SilverQuestions.question_id == question_id).values(explanation_status=status))
    db.commit()


def explanation_job(question_id: str, expected_hash: str):
    db = SessionLocal()
    try:
        question = db.get(SilverQuestions, question_id)
        if question is None or content_hash(question) != expected_hash:
            logger.info("Skipping question %s: deleted or edited since queued", question_id)
            return
        if question.explanation_status in ("generating", "done", "needs_review"):
            logger.info("Skipping question %s: already %s", question_id, question.explanation_status)
            return 
        _set_status(db, question_id, "generating")

        # Generate the AI answer explanations and saves to db
        explanation = generate_answer_explanation(question)
        save_answer_explanation(db, explanation)
        
        if explanation.status == "needs_review":
            logger.warning("Answer mismatch for question %s; flagged for review", question_id)
    except anthropic.BadRequestError as e:
        if "credit balance" in str(e):
            logger.critical("Anthropic credits exhausted; stopping run")
            raise SystemExit(1)
    except IntegrityError:
        db.rollback()
        logger.exception("Bad data for question %s; not retrying", question_id)
        _set_status(db, question_id, "failed")
    except Exception:
        db.rollback()
        logger.exception("Explanation job after question %s", question_id)
        _set_status(db, question_id, "failed")
        raise                                    # network or API errors: let RQ retry
    finally:
        db.close()

    # Logging happens after the try block, so a logging problem can never mark a saved question as failed
    if explanation.status == "needs_review":
        logger.warning("Answer mismatch; flagged for review", extra={"question_id": str(question_id), "answer": explanation.answer_key})
    else:
        logger.info("Explanation saved", extra={"question_id": str(question_id)})