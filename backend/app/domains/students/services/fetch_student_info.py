from fastapi import HTTPException
from sqlalchemy import func 
from sqlalchemy.orm import Session

from app.domains.students.models import SilverUsers, TestScores
from app.domains.analytics.models import SilverAnalytics
from app.domains.analytics.models import GoldAnalytics, GoldSubtopicMastery
from app.domains.analytics.services.question_stats import compute_question_stats
from app.domains.errors.error_handler import handle_db_errors



# Fetches the student's info, test scores, and most recent analysis based on clerk_id 
def fetch_student_info(clerk_id:str, db:Session):

    with handle_db_errors(db, "fetching student's information"):
        # Fetch student's information (eg first and last name, school)
        student_info = db.query(SilverUsers).filter(SilverUsers.clerk_id == clerk_id).first()

        # Checks to see if student exists
        if not student_info:
            raise HTTPException(status_code=404, detail="Student not found")

        # Retrieves student's question attempts
        question_stats = compute_question_stats(clerk_id, db)
        
        # Add student_test_score
        test_score = db.query(TestScores).filter(TestScores.clerk_id == clerk_id).order_by((TestScores.created_at).desc()).all()

        # Retrieves the student's past analytics
        past_analytics = db.query(SilverAnalytics).filter(SilverAnalytics.clerk_id == clerk_id).order_by((SilverAnalytics.completed_at).desc()).all()

        # Retrieves the latest analytics for the student 
        student_analytics = db.query(GoldAnalytics).filter(GoldAnalytics.clerk_id == clerk_id).order_by((GoldAnalytics.completed_at).desc()).first()

        # Retrieves student's weak subtopics
        subtopics_mastery = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id == clerk_id).all()
        # TODO fix the weak_subtopics => create a schema, update the API, 

    return student_info, question_stats, test_score, past_analytics, student_analytics, subtopics_mastery

