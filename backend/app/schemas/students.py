from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import date

class OriginalScore(BaseModel):
    original_score: int
    reading_score: int
    math_score: int

class LearningTargets(BaseModel):
    daily_goal: int
    weekly_goal: int

class RegisterStudents(BaseModel):
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
    referral: str