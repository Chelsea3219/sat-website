from fastapi import APIRouter, Depends
from typing import List

from app.core.database import get_db

from app.domains.students.fetch_student_info import fetch_student_info
from app.schemas.students import IncomingStudentInformation

router = APIRouter(prefix="/api/students", tags=["students"])


# Fetch student's information
@router.get("/fetch-student-info/{clerk_id}/")
async def fetch_student_information(clerk_id:str, db=Depends(get_db)) -> IncomingStudentInformation:

    # Fetches student's information 
    student_info, test_score, student_analytics = fetch_student_info(clerk_id, db)

    student_information = {
        "student_info": student_info,
        "test_scores": test_score,
        "student_analytics": student_analytics
    }

    return student_information