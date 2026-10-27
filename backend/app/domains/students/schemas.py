from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, Dict, List
from datetime import date, datetime
from uuid import UUID

from app.domains.analytics.schemas import IncomingGoldSubtopicMastery, IncomingSilverAnalytics, IncomingGoldAnalytics, QuestionStats


class OriginalScore(BaseModel):
    original_score: int
    reading_score: int
    math_score: int


class LearningTargets(BaseModel):
    daily_goal: int
    weekly_goal: int


# student base for bronze and silver users
class StudentBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    school: str | None
    state: str | None
    grade_level: str | None
    original_score: OriginalScore | None
    dream_score: str | int | None 
    test_date: Optional[date] = None
    learning_targets: LearningTargets | None


class RegisterStudents(StudentBase):
    referral: str


class IncomingStudentInfo(StudentBase):
    updated_at: datetime 


class IncomingTestScores(BaseModel):
    id: UUID
    clerk_id: str
    current_score: OriginalScore
    dream_score: int
    type: str 
    test_date: date
    created_at: datetime


class IncomingStudentInformation(BaseModel):
    student_info: IncomingStudentInfo | None
    question_stats: QuestionStats
    test_scores: List[IncomingTestScores]
    # past_analytics: Optional[List[IncomingSilverAnalytics]] = None
    quiz_analytics: Optional[List[IncomingGoldAnalytics]] = None
    subtopic_mastery: Optional[List[IncomingGoldSubtopicMastery]] = None 
    

