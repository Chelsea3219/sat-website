# Import Python libraries and files 
from sqlalchemy import func, case, select
from sqlalchemy.orm import Session
from datetime import datetime, time, timedelta
from app.domains.analytics.models import QuestionAttempts
from app.domains.errors.error_handler import handle_db_errors


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


def compute_daily_stats(clerk_id: str, db:Session) -> dict:
    now = datetime.now()

    today_start = datetime.combine(now.date(), time.min)
    today_end = datetime.combine(now.date(), time.max)

    start_of_week = today_start - timedelta(days=now.weekday())
    end_of_week = start_of_week + timedelta(days=7)
    
    with handle_db_errors(db, "fetching daily question stats"):

        daily_stats = (
            select(
                func.count(QuestionAttempts.id).label("num_questions"),
                func.sum(QuestionAttempts.time_elapsed).label("time_spent")
            ).where(
                QuestionAttempts.clerk_id == clerk_id,
                QuestionAttempts.completed_at >= today_start,
                QuestionAttempts.completed_at <= today_end,
            )
        )
        daily_results = db.execute(daily_stats).first()


        weekly_stats = (
            select(
                func.count(QuestionAttempts.id).label("weekly_num_questions"),
                func.sum(QuestionAttempts.time_elapsed).label("weekly_time_spent"),
            ).where(
                QuestionAttempts.clerk_id == clerk_id,
                QuestionAttempts.completed_at >= start_of_week,
                QuestionAttempts.completed_at <= end_of_week,
            )
        )
        weekly_results = db.execute(weekly_stats).first()

        stats = {
            "num_questions": daily_results.num_questions or 0,
            "time_spent": daily_results.time_spent  or 0,
            "weekly_num_questions": weekly_results.weekly_num_questions or 0,
            "weekly_time_spent": weekly_results.weekly_time_spent or 0
        }
        print("stats", stats)

        return stats