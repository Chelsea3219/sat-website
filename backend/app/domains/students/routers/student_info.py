import pprint 
from fastapi import APIRouter, Depends

from app.core.database import get_db

from app.domains.students.services.fetch_student_info import fetch_student_info
from app.domains.students.schemas import IncomingStudentInformation

router = APIRouter(prefix="/api/students", tags=["students"])


# Fetch student's information
@router.get("/fetch-student-info/{clerk_id}/")
async def fetch_student_information(clerk_id:str, db=Depends(get_db)) -> IncomingStudentInformation : # -> IncomingStudentInformation

    # Fetches student's information 
    student_info, question_stats, test_score, past_analytics, student_analytics, subtopics_mastery = fetch_student_info(clerk_id, db)

    student_information = {
        "student_info": student_info,
        "question_stats": question_stats,
        "test_scores": test_score,
        "past_analytics" : past_analytics, 
        "student_analytics": student_analytics, 
        "subtopic_mastery": subtopics_mastery
    }

    # Preview the results
    # pprint.pprint(student_information)

    return student_information