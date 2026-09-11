from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, Dict, List
from datetime import date, datetime
from uuid import UUID


class IncomingAnswerSheet(BaseModel):
    clerk_id: str 
    question_id: UUID
    section: str
    topic: str
    subtopic: List[str]
    difficulty: str
    answer: str
    is_correct: bool
    time_elapsed: int
    completed_at: datetime 