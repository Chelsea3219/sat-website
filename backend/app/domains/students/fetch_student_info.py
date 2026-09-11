from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.silver import SilverUsers, TestScores
from app.models.gold import GoldAnalytics, GoldSubtopicMastery
from app.domains.errors.error_handler import handle_db_errors



# Fetches the student's info, test scores, and most recent analysis based on clerk_id 
def fetch_student_info(clerk_id:str, db:Session):

    with handle_db_errors(db, "fetching student's information"):
        # Fetch student's information (eg first and last name, school)
        student_info = db.query(SilverUsers).filter(SilverUsers.clerk_id == clerk_id).first()

        # Checks to see if student exists
        if not student_info:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Add student_test_score
        test_score = db.query(TestScores).filter(TestScores.clerk_id == clerk_id).all()

        # Determines the last analytics for the student 
        student_analytics = db.query(GoldAnalytics).filter(GoldAnalytics.clerk_id == clerk_id).order_by((GoldAnalytics.completed_at).asc()).first()

        # Retrieves student's weak subtopics
        weak_subtopics = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id == clerk_id).all()

    return student_info, test_score, student_analytics, weak_subtopics


