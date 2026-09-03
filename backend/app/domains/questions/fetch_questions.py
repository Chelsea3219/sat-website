from sqlalchemy.orm import Session

from app.models.silver import SilverQuestions
from app.domains.errors.error_handler import handle_db_errors

def fetch_db_questions(section:str, db:Session):
    with handle_db_errors(db, "fetching section questions"):
        questions = db.query(SilverQuestions).filter(SilverQuestions.section == section).all()
        return questions 
    