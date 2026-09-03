from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, List, Dict 
from datetime import date, datetime
from uuid import UUID

class IncomingQuestions(BaseModel):
    question_id: UUID
    section: str
    topic: str
    subtopic: List[str]

    difficulty: str
    time_estimate: int

    question_preview: Optional[str] = None
    question_type: str
    mc_preview: Optional[str] = None  

    text: str
    equation: Optional[str] = None  
    diagram: Optional[str] = None  
    multiple_choices: Optional[Dict[str, str]] = None

    answer_key: str
    answer_active: bool 
    updated_at: datetime

    class Config:
        from_attributes = True  # allows creating this from SQLAlchemy model instances (Pydantic v2 name; use orm_mode=True on v1)
