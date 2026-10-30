# Import Python libraries and files 
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select, func 
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import SearchRawQuestions, RawQuestionsIn

from app.core.database import get_db
from app.core.auth import require_auth
from app.domains.questions.models import BronzeQuestions

router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# FETCHES RAW QUESTIONS FROM THE BRONZE.RAW_QUESTIONS
@router.get("/fetch-raw-questions")
def fetch_raw_questions(
    search_info: SearchRawQuestions = Depends(),   # maps query parameters to the model
    db: Session = Depends(get_db),
) -> List[RawQuestionsIn]:
    # TODO add an admin authorization/authentication function 

    # Selects all the unreviewed questions
    conditions = [BronzeQuestions.reviewed.is_(False)]

    # Exact-match filters: only add the ones that were sent
    for field in ("section", "topic", "source"):
        value = getattr(search_info, field)
        if value:
            normalized_value = value.replace(" and ", " & ").strip()
            conditions.append(getattr(BronzeQuestions, field) == normalized_value)

    # subtopic is an array column: match questions that contain it
    if search_info.subtopic:
        conditions.append(
            func.lower(func.trim(BronzeQuestions.subtopic)) == search_info.subtopic.strip().lower()
        )

    with handle_db_errors(db, "fetching bronze questions based on the search parameters"):
        statement = select(BronzeQuestions).where(*conditions)
        return db.scalars(statement).all()