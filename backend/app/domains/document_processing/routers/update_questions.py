# Import Python libraries and files 
import logging
from typing import List
from rq import Queue, Retry
from datetime import datetime, timezone, UTC
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select 
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import CleanQuestions

from app.core.database import get_db
from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.auth import require_admin

from app.domains.database.upsert import upsert
from app.domains.questions.utils import content_hash
from app.domains.questions.models import BronzeQuestions, SilverQuestions

from app.worker.explanation.explanation_job import explanation_job
from app.worker.explanation.queues import realtime_queue


setup_logging()
logger = logging.getLogger("update-questions")
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"], dependencies=[Depends(require_admin)])


# UPDATES THE RAWS QUESTIONS IN THE BRONZE LAYER AND LOADS THEM IN THE SILVER LAYER
# TODO change the function to accept a list of questions so that i can update a list of questions at a time
@router.post("/update-raw-question")
def update_raw_question(questions: List[CleanQuestions], db: Session = Depends(get_db)):
    to_enqueue = []
    now = datetime.now(timezone.utc)
    silver_columns = {c.key for c in SilverQuestions.__table__.columns}
    num_updated = 0 

    with handle_db_errors(db, "updating raw questions from bronze.questions table"):
        for question in questions:
            # Checks to see if the question exists in the bronze.raw_questions
            bronze_question = db.query(BronzeQuestions).filter(BronzeQuestions.question_id == question.question_id).first()
            if not bronze_question:
                raise HTTPException(status_code=404, detail="Question not found")
            bronze_question.reviewed = True # Updates Questions in the bronze.raw_questions
            db.flush() # Updates the question in the bronze layer before inserting it into the silver layer


            # If silver_question exist, update. Else add question to silver table
            data = question.model_dump(mode="json", exclude={"question_id"})
            if data.get("question_type") != "multiple choice":
                data["multiple_choices"] = None
            data = {k: v for k, v in data.items() if k in silver_columns}

            silver = db.get(SilverQuestions, question.question_id)
            if silver is None:
                silver = SilverQuestions(
                    question_id=question.question_id, 
                    **data,
                    updated_at=now,
                    explanation_status="generating"
                )
                db.add(silver)
                # Add question to answer_explanation queue 
                to_enqueue.append( (str(bronze_question.question_id), content_hash(silver)))
            else: 
                updated_fields = {k:v for k,v in data.items() if getattr(silver, k) != v}
                updated_fields["updated_at"] = now
                upsert(db, SilverQuestions, lookup_field="question_id", lookup_value=question.question_id, **updated_fields)
            num_updated += 1
                
        db.commit()

    # Generates the hints_answer_explanations, updates the explanation_status, and  insert into the silver schema 
    try:
        realtime_queue.enqueue_many([
            Queue.prepare_data(
                explanation_job, 
                args=(qid, h),
                job_id=f"explain-{qid}-{h}", 
                retry=Retry(max=3, interval=[60, 120, 300]), 
            )
            for qid, h in to_enqueue
        ])
    except Exception:
        logger.exception("Failed to enqueue explanation job; sweeper will retry")
    return {"added": num_updated}
