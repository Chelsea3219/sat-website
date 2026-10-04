from fastapi import HTTPException
from sqlalchemy import func 
from sqlalchemy.orm import Session

from app.domains.students.models import SilverUsers, TestScores
from app.domains.analytics.models import SilverAnalytics, QuestionAttempts, SilverSubtopicMasteryModel
from app.domains.analytics.models import GoldAnalytics, GoldSubtopicMastery
from app.domains.analytics.services.question_stats import compute_question_stats
from app.domains.errors.error_handler import handle_db_errors



# Fetches the student's info, test scores, and most recent analysis based on clerk_id 
def fetch_student_information(clerk_id:str, db:Session):
     # Fetch student's information (eg first and last name, school)
    student_info = fetch_student_info(clerk_id, db)

    # Retrieves the student test scores 
    test_scores = fetch_test_scores(clerk_id, db)

    # Retrieves student's question attempts
    question_stats = compute_question_stats(clerk_id, db)

    # Fetches student's section, topic, and subtopic mastery scores 
    section_topic_mastery = fetch_topic_mastery(clerk_id, db)
    subtopics_mastery = fetch_subtopic_mastery(clerk_id, db)
    
    return student_info, question_stats, test_scores, section_topic_mastery, subtopics_mastery


def fetch_subtopic_mastery(clerk_id: str, db:Session):
    with handle_db_errors(db, "fetching student's subtopic mastery scores from the gold schema."):
        subtopic_mastery = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id == clerk_id).order_by((GoldSubtopicMastery.last_wrong_at).desc()).all()
    return subtopic_mastery

def fetch_topic_mastery(clerk_id: str, db:Session):
    with handle_db_errors(db, "fetching student's section and topic mastery scores from the gold schema."):
        topic_mastery = db.query(GoldAnalytics).filter(GoldAnalytics.clerk_id == clerk_id).order_by((GoldAnalytics.completed_at).desc()).all()
    return topic_mastery

def fetch_test_scores(clerk_id: str, db:Session):
    with handle_db_errors(db, "fetching student's test scores."):
        test_scores = db.query(TestScores).filter(TestScores.clerk_id == clerk_id).order_by((TestScores.created_at).desc()).all()
    return test_scores

def fetch_student_info(clerk_id:str, db:Session):
    with handle_db_errors(db, "fetching student's information"):
        # Fetch student's information (eg first and last name, school)
        student_info = db.query(SilverUsers).filter(SilverUsers.clerk_id == clerk_id).first()
        # Checks to see if student exists
        if not student_info:
            raise HTTPException(status_code=404, detail="Student not found")
    return student_info


def fetch_question_attempts(clerk_id, db: Session):
    with handle_db_errors(db, "fetching question attempts from silver schema"):
        results = db.query(QuestionAttempts).filter(QuestionAttempts.clerk_id == clerk_id).all()
    return results


def fetch_past_subtopic_mastery(clerk_id, db: Session):
    with handle_db_errors(db, "fetching past subtopic mastery from the silver practice analytics table."):
        results = db.query(SilverSubtopicMasteryModel).filter(SilverSubtopicMasteryModel.clerk_id == clerk_id).all()
        return results 
