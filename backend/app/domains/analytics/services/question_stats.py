# Import Python libraries and files 
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from app.domains.analytics.models import QuestionAttempts


# Determine the numQuestions, numCorrect, timeSpent for each student
def compute_question_stats(clerk_id: str, db: Session) -> dict:
    result = db.query(
        func.count(QuestionAttempts.id).label("num_questions"),
        func.sum(case((QuestionAttempts.is_correct == True, 1), else_=0)).label("num_correct"),
        func.sum(QuestionAttempts.time_elapsed).label("time_spent")
    ).filter(QuestionAttempts.clerk_id == clerk_id).one()

    question_stats = {
        "num_questions": result.num_questions or 0,
        "num_correct": result.num_correct or 0,
        "time_spent": result.time_spent or 0
    }
    
    return question_stats