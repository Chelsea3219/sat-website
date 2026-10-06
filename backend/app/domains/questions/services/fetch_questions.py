# Import Python Libaries and files 
import json 
from sqlalchemy import cast 
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB
from typing import List

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