# Import Python libraries and files 
import logging
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import AddQuestions 

from app.core.database import get_db
from app.domains.questions.models import BronzeQuestions, SilverQuestions


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# ADD THE NEW QUESTION IN THE BRONZE AND SILVER LAYER
@router.post("/add-questions")
async def add_questions(questions: List[AddQuestions], db: Session = Depends(get_db)):
    with handle_db_errors(db, "adding new questions to bronze and silver questions table"):
        for question in questions:
            # Adds the questions to the bronze.questions tables 
            bronze_question = BronzeQuestions(
                section=question.section,
                topic=question.topic,
                subtopic=question.subtopic[0],

                question_preview=question.question_preview,
                question_type=question.question_type,
                mc_preview=question.mc_preview,
                text=question.text,

                uploaded_at=datetime.now(),
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

                multiple_choices=question.multiple_choices,
                answer_key=question.answer_key,

                updated_at=datetime.now(),
                answer_active=False
            )
            db.add(clean_question)
            db.commit()