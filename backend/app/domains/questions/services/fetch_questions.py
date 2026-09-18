# Import Python Libaries and files 
import json 
from sqlalchemy import cast 
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB
from typing import List

from app.domains.questions.schemas import IncomingQuestions
from app.domains.questions.models import SilverQuestions
from app.domains.errors.error_handler import handle_db_errors



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