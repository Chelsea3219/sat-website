import pprint 
from fastapi import APIRouter, Depends

from app.core.database import get_db

from app.domains.analytics.services.question_stats import compute_daily_stats
from app.domains.students.services.fetch_student_info import fetch_student_information
from app.domains.students.schemas import IncomingStudentInformation

router = APIRouter(prefix="/api/students", tags=["students"])


# Fetch student's information
@router.get("/fetch-student-info/{clerk_id}/")
async def student_information(clerk_id:str, db=Depends(get_db)) -> IncomingStudentInformation : # -> IncomingStudentInformation

    # Fetches student's information 
    student_info, question_stats, test_score, quiz_analytics, subtopics_mastery = fetch_student_information(clerk_id, db)

    student_information = {
        "student_info": student_info,
        "question_stats": question_stats,
        "test_scores": test_score,
        "quiz_analytics": quiz_analytics, 
        "subtopic_mastery": subtopics_mastery
    }

    # Preview the results
    # pprint.pprint(student_information)

    return student_information


@router.get("/fetch-daily-stats/{clerk_id}")
async def fetch_daily_stats(clerk_id, db=Depends(get_db)):
    results = compute_daily_stats(clerk_id=clerk_id, db=db)
    return results