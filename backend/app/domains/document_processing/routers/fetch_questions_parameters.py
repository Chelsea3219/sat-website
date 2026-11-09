# Import Python libraries and files 
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select, func 
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import SearchParameters

from app.core.database import get_db
from app.core.auth import require_admin
from app.domains.questions.models import BronzeQuestions, SilverQuestions

router = APIRouter(prefix="/api/document-processing", tags=["document-processing"], dependencies=[Depends(require_admin)])




# TODO remove the fetch raw questions after perfecting search questions 
@router.get("/search-questions")
def search_questions(search_parameters: SearchParameters = Depends(), db: Session = Depends(get_db)):

    # Determine if the questions need to be fetched from the bronze or silver table 
    is_silver = search_parameters.reviewed is True
    model = SilverQuestions if is_silver else BronzeQuestions

    conditions = []
    if not is_silver:
        conditions.append(BronzeQuestions.reviewed.is_(False))

    # Exact-math Filters
    for field in ("question_id", "section", "topic", "source"):
        value = getattr(search_parameters, field)
        if value and hasattr(model, field):
            normalized_value = value.replace(" and ", " & ").strip()
            conditions.append(getattr(model, field) == normalized_value) 

    # subtopic is an array column: match questions that contain it
    if search_parameters.subtopic:
        subtopic = search_parameters.subtopic.strip().lower()
        if is_silver:
            conditions.append(SilverQuestions.subtopic.contains([subtopic]))
        else:
            conditions.append(func.lower(func.trim(BronzeQuestions.subtopic)) == subtopic )

    # Search the text
    if search_parameters.text:
        search_term = f"%{search_parameters.text.strip()}%"
        conditions.append( model.text.ilike(search_term) )

    with handle_db_errors(db, "fetching bronze questions based on the search parameters"):
        statement = select(model).where(*conditions)
        return db.scalars(statement).all() 
