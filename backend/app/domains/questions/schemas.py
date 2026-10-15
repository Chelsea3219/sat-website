# Import Python libraries and files 
from pydantic import BaseModel, ConfigDict
from typing import Literal, Optional, List, Dict 
from datetime import date, datetime
from uuid import UUID

from app.domains.document_processing.schemas import MC 

# Incoming Questions from the SilverQuestions table
class IncomingQuestions(BaseModel):
    model_config = ConfigDict(from_attributes=True) # allows creating this from SQLAlchemy model instances (Pydantic v2 name; use orm_mode=True on v1)

    question_id: UUID | str 
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
    explanation_status: Literal["pending", "generating", "done", "failed"]
    updated_at: datetime



class PracticeSession(BaseModel):
    selected_questions: List[IncomingQuestions]
    in_session_score: float 