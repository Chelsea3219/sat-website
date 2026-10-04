# Import Python libraries and files 
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import CleanQuestions

from app.core.database import get_db
from app.domains.questions.models import BronzeQuestions, SilverQuestions

router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# UPDATES THE RAWS QUESTIONS IN THE BRONZE LAYER AND LOADS THEM IN THE SILVER LAYER
# TODO change the function to accept a list of questions so that i can update a list of questions at a time
@router.post("/update-raw-question")
async def update_raw_question(questions: List[CleanQuestions], db: Session = Depends(get_db)):
    with handle_db_errors(db, "updating raw questions from bronze.questions table"):
        for question in questions:
            # Checks to see if the question exists in the bronze.raw_questions
            bronze_question = db.query(BronzeQuestions).filter(BronzeQuestions.question_id == question.question_id).first()
            if not bronze_question:
                raise HTTPException(status_code=404, detail="Question not found")

            # Updates Questions in the bronze.raw_questions
            bronze_question.reviewed = True
            db.flush() # Updates the question in the bronze layer before inserting it into the silver layer

            # Adds the questions to the silver.clean_questions
            clean_question = SilverQuestions(
                question_id=question.question_id,
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
        return 
