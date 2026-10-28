import logging 
import requests
import pprint 
from sqlalchemy import select 
from sqlalchemy.orm import Session 
from datetime import datetime, timezone
from fastapi import Depends
from pydantic import BaseModel, ConfigDict
from typing import List 

from app.core.database import get_db, SessionLocal
from app.core.logging_config import setup_logging

from app.domains.errors.error_handler import handle_db_errors
from app.domains.questions.models import BronzeQuestions, SilverQuestions
from app.domains.answer_explanations.models import SilverHintsAnswerExplanations
from app.domains.questions.services.time_estimate import time_estimate

from app.domains.answer_explanations.services.generate_answer_explanation import generate_answer_explanation
from app.domains.answer_explanations.services.save_explanation import save_answer_explanation


setup_logging()
logger = logging.getLogger("uploading_pinesat_questions")


class QuestionContent(BaseModel):
    choices: dict[str, str]
    question: str
    paragraph: str = ""
    explanation: str = ""
    correct_answer: str

class PineSATQuestion(BaseModel):
    id: str
    domain: str
    visuals: dict[str, str] | None = None
    question: QuestionContent
    difficulty: str
    
# Download questions from pine_SAT
def fetch_pinesat_questions() -> list[PineSATQuestion]:
    url = "https://pinesat.duckdns.org/api/questions"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return [PineSATQuestion.model_validate(item) for item in response.json()]


def upload_pinesat_questions(questions: List[PineSATQuestion]):
    to_enqueue = []
    now = datetime.now(timezone.utc)
    db = SessionLocal()

    try:
        for q in questions:
            """# Checks to see if question exists by looking at the text 
            statement =  select(SilverQuestions).where(SilverQuestions.text == q.question.paragraph)
            query = SilverQuestions.scalars(statement).all()
            if query is None:
                return """

            # Normalize the questions  
            topic = q.domain.lower().replace(" and ", " & ")
            difficulty = q.difficulty.lower()

            # Upload questions to the bronze table 
            bronze_question = BronzeQuestions(
                section="reading",
                topic=topic, 

                question_type="multiple choice",
                text=q.question.paragraph, 
                reading_question=q.question.question,

                uploaded_at = now, 
                source="pinesat", 
                reviewed=False
            )
            db.add(bronze_question)
            db.flush()

            # Upload questions in the silver questions table
            silver_question = SilverQuestions(
                question_id = bronze_question.question_id, 
                section="reading", 
                topic=topic, 

                difficulty=difficulty, 
                time_estimate= time_estimate(difficulty), 
                
                question_type="multiple choice",
                text=q.question.paragraph, 
                reading_question=q.question.question,
                multiple_choices=q.question.choices, 
                answer_key=q.question.correct_answer, 

                updated_at = now, 
                explanation_status="generating"
            )
            db.add(silver_question)
            db.flush()

            # Add the explanation to Silver Hints and Answer 
            db.add(SilverHintsAnswerExplanations(
                question_id = bronze_question.question_id, 
                answer_key=q.question.correct_answer, 
                question_explanation=q.question.explanation,
                status="generating", 
                created_at=now
            ))

            # Generate the rest of the answer explanation
            ai_explanation = generate_answer_explanation(silver_question)
            save_answer_explanation(db, ai_explanation)

        db.commit()
    except Exception:
        db.rollback
        raise
    finally:
        db.close()
    return len(questions)
    


# Test the function 
# python -m app.domains.questions.datasets.pinesat_questions
if __name__ == "__main__":
    pinesat_questions = fetch_pinesat_questions()
    questions = pinesat_questions[14:]
    upload_pinesat_questions(questions)
