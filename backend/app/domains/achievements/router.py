# Import Python libraries and files 
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.domains.achievements.schemas import Achievement
from app.domains.achievements.services import compute_achievements
from app.domains.questions.schemas import IncomingQuestions, PracticeSession
from app.domains.students.services.fetch_student_info import fetch_student_info, fetch_topic_mastery, fetch_question_attempts, fetch_past_subtopic_mastery

router = APIRouter(prefix="/api", tags=["achievements"])


@router.get("/achievements/{clerk_id}")
def get_achievements(clerk_id: str, db=Depends(get_db)) -> List[Achievement]:
    question_attempts = fetch_question_attempts(clerk_id, db)

    past_subtopic_mastery = fetch_past_subtopic_mastery(clerk_id, db)

    practice_dates = [a.completed_at.date() for a in question_attempts]

    quizzes = fetch_topic_mastery(clerk_id, db)

    # TODO create a function to reward the student for improving student's section and subtopic mastery score
    quiz_scores = [q.reading_mastery["mastery_score"] + q.math_mastery["mastery_score"] for q in quizzes]

    return compute_achievements(practice_dates, question_attempts, quizzes, past_subtopic_mastery)