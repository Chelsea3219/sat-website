from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, Dict, List
from datetime import date, datetime
from uuid import UUID
class OriginalScore(BaseModel):
    original_score: int
    reading_score: int
    math_score: int

class LearningTargets(BaseModel):
    daily_goal: int
    weekly_goal: int

# student base for bronze and silver users
class StudentBase(BaseModel):
    clerk_id: str
    first_name: str 
    last_name: str
    email: EmailStr

    school: str
    state: str
    grade_level: str

    original_score: OriginalScore
    dream_score: int
    test_date: Optional[date] = None

    subscription: str
    learning_targets: LearningTargets


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


class IncomingStudentAnalytics(BaseModel):
    session_id: UUID
    clerk_id: str
    type: str
    topic: str 
    reading_mastery: Dict[str, int]
    reading_topics_mastery: Dict[str, Dict[str, int]]
    math_mastery: Dict[str, int]
    math_topics_mastery: Dict[str, Dict[str, int]]
    completed_at: datetime


class IncomingStudentInformation(BaseModel):
    student_info: IncomingStudentInfo
    test_scores: List[IncomingTestScores]
    student_analytics: IncomingStudentAnalytics

