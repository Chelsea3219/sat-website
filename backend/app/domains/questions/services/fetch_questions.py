# Import Python Libaries and files 
import json 
import logging 
from sqlalchemy import cast, select, or_, and_
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB
from typing import List
from pydantic import ValidationError

from app.core.logging_config import setup_logging
setup_logging()
logger = logging.getLogger("fetch_questions")

from app.domains.questions.schemas import IncomingQuestions
from app.domains.questions.models import SilverQuestions
from app.domains.errors.error_handler import handle_db_errors
from app.domains.questions.services.question_ids import math_quiz_ids, reading_quiz_ids


# Fetches questions based on section
def fetch_section_questions(section:str, db:Session) -> List[IncomingQuestions]:
    with handle_db_errors(db, "fetching section questions"):
        questions = db.query(SilverQuestions).filter(SilverQuestions.section == section).all()
        return questions 


# Fetches questions based on subtopic
def fetch_subtopic_questions(subtopic: str, db:Session, exclude_ids:list) -> List[IncomingQuestions]:
    with handle_db_errors(db, "fetching subtopic questions"):
        questions = db.query(SilverQuestions).filter(cast(SilverQuestions.subtopic, JSONB).contains(json.dumps([subtopic]))).all()

        # Remove questions that the student already answered
        selected_questions = [q for q in questions if q.question_id not in exclude_ids]
        return selected_questions


# Fetches quiz questions for guest
def fetch_guest_quiz_questions(section:str, db: Session) -> List[IncomingQuestions]:
    question_ids = math_quiz_ids if section == "math" else reading_quiz_ids
    if not question_ids:
        return []

    with handle_db_errors(db, "fetching quiz questions for demo"):
        questions = db.query(SilverQuestions).filter(SilverQuestions.question_id.in_(question_ids)).all()
        return questions



def fetch_unanswered_questions(db: Session, limit: int =5000 ) -> List[IncomingQuestions | None]:
    with handle_db_errors(db, "fetching unanswered questions from silver questions table "):
        query = select(SilverQuestions).where(SilverQuestions.explanation_status.in_(["pending", "failed", "generating"])).limit(limit)
        results = db.scalars(query).all()

        questions = []
        for r in results:
            try:
                questions.append(IncomingQuestions.model_validate(r))
            except ValidationError as e:
                logger.warning("Skipping invalid question %s: %s", r.get("id"), e)
        return questions 