# Import Python libraries and files 
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import SearchRawQuestions, RawQuestionsIn

from app.core.database import get_db
from app.domains.questions.models import BronzeQuestions

router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# FETCHES RAW QUESTIONS FROM THE BRONZE.RAW_QUESTIONS
@router.get("/fetch-raw-questions")
async def fetch_raw_questions(search_info: SearchRawQuestions = Depends(), db: Session = Depends(get_db)) -> List[RawQuestionsIn]: # Depends() maps query parameters to the model

    with handle_db_errors(db, "fetching questions based on parameters"):
        # Fetches the bronze.raw_questions
        query = db.query(BronzeQuestions).filter(BronzeQuestions.reviewed.is_(False))

        # Filters based on conditions
        if search_info.section:
            query = query.filter(BronzeQuestions.section == search_info.section)
        if search_info.topic:
            query = query.filter(BronzeQuestions.topic == search_info.topic)
        if search_info.subtopic:
            query = query.filter(BronzeQuestions.subtopic == search_info.subtopic)

        db.commit()
        return query.all()