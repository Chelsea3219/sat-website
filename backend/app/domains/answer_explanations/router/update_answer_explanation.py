

# Import Python libraries and files 
import logging
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors

from app.core.database import get_db
from app.core.logging_config import setup_logging
from app.core.auth import require_admin

from app.domains.database.upsert import upsert
from app.domains.answer_explanations.models import SilverHintsAnswerExplanations
from app.domains.answer_explanations.schemas import OutgoingAnswerExplanations



setup_logging()
logger = logging.getLogger("update-answer-explanation")
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"], dependencies=[Depends(require_admin)])


# UPDATES THE ANSWER EXPLANATION

@router.post("/save-answer-explanation")
def save_answer_explanation(
    explanations: List[OutgoingAnswerExplanations],
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)

    silver_columns = {
        c.key for c in SilverHintsAnswerExplanations.__table__.columns
    }

    num_added = 0
    num_updated = 0

    excluded_fields = { "question_id", "answer_id", "status",
        "created_at",
        "updated_at",
    }

    with handle_db_errors(db, "saving answer explanations"):

        for ex in explanations:

            data = ex.model_dump(
                mode="json",
                exclude=excluded_fields
            )

            data = {
                k: v for k, v in data.items()
                if k in silver_columns
            }

            # Look up by question_id, not the model's primary key
            existing = (
                db.query(SilverHintsAnswerExplanations)
                .filter(
                    SilverHintsAnswerExplanations.question_id == ex.question_id
                )
                .first()
            )

            if existing is None:

                silver = SilverHintsAnswerExplanations(
                    question_id=ex.question_id,
                    **data,
                    status="approved",
                    created_at=now,
                    updated_at=now,
                )

                db.add(silver)
                num_added += 1

            else:

                updated = False

                for key, value in data.items():
                    if getattr(existing, key) != value:
                        setattr(existing, key, value)
                        updated = True

                if updated:
                    existing.updated_at = now
                    num_updated += 1

        db.commit()

    return {
        "added": num_added,
        "updated": num_updated
    }

