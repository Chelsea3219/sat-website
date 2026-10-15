# Import Python libraries and files 
import logging
from datetime import datetime, timezone
from rq import Queue, Retry
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import AddQuestions 

from app.core.database import get_db
from app.core.logging_config import setup_logging
from app.domains.questions.models import BronzeQuestions, SilverQuestions
from app.domains.questions.utils import content_hash

from app.worker.explanation.explanation_job import explanation_job
from app.worker.explanation.queues import explanations_queue

from app.domains.answer_explanations.services.normalization import normalize_answer_key, normalize_choices

setup_logging()
logger = logging.getLogger("add-questions")
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# ADD THE NEW QUESTION IN THE BRONZE AND SILVER LAYER
@router.post("/add-questions")
def add_questions(questions: List[AddQuestions], db: Session = Depends(get_db)):
    to_enqueue = []
    now = datetime.now(timezone.utc)
    with handle_db_errors(db, "adding new questions to bronze and silver questions table"):
        for question in questions:
            # Normalization
            answer_key = normalize_answer_key(question.answer_key)

            # Adds the questions to the bronze.questions tables 
            bronze_question = BronzeQuestions(
                section=question.section,
                topic=question.topic,
                subtopic=question.subtopic[0],

                question_preview=question.question_preview,
                question_type=question.question_type,
                mc_preview=question.mc_preview,
                text=question.text,

                uploaded_at=now,
                source=question.source,
                reviewed=True
            )
            db.add(bronze_question)
            db.flush()


            # Adds the questions to the silver.clean_questions
            clean_question = SilverQuestions(
                question_id=bronze_question.question_id,
                section=question.section,
                topic=question.topic,
                subtopic=question.subtopic,

                difficulty=question.difficulty,
                time_estimate=question.time_estimate,

                question_preview=question.question_preview,
                question_type=question.question_type,
                mc_preview=question.mc_preview,

                text=question.text,
                equation=question.equation,
                diagram=question.diagram,

                multiple_choices=question.multiple_choices.model_dump(), 
                answer_key=answer_key,

                updated_at=now,
                explanation_status="pending"
            )
            db.add(clean_question)
            to_enqueue.append( (str(bronze_question.question_id), content_hash(clean_question)))

        db.commit()

    # Generates the hints_answer_explanations, updates the explanation_status, and  insert into the silver schema 
    try:
        explanations_queue.enqueue_many([
            Queue.prepare_data(
                explanation_job, 
                args=(qid, h),
                job_id=f"explain-{qid}-{h}", 
                retry=Retry(max=3, interval=[60, 120, 300]), 
            )
            for qid, h in to_enqueue
        ])
    finally:
        return {"added": len(to_enqueue)}