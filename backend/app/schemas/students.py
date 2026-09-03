from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, Dict 
from datetime import date

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
    updated_at: str 


class IncomingStudentAnalytics(BaseModel):
    session_id: str
    clerk_id: str
    type: str
    topic: str 
    reading_mastery: Dict[str, int]
    reading_topics_mastery: Dict[str, Dict[str, int]]
    math_mastery: Dict[str, int]
    math_topics_mastery: Dict[str, Dict[str, int]]
    weak_subtopics: Dict[str, Dict]
    completed_at: str 