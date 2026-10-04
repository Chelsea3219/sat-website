import uuid
from datetime import date, datetime

from pydantic import BaseModel
from typing import Optional, List, Union


# Class for incoming raw_questions from the frontend
class UploadRawQuestions(BaseModel):
    section: str
    topic: str
    subtopic: str
    question_preview: str
    question_type: str
    mc_preview: Optional[str] = None
    text: str
    source: str


# Class for incoming raw_questions from the database
class RawQuestionsIn(BaseModel):
    question_id: uuid.UUID
    section: str
    topic: str
    subtopic: str
    question_preview: str
    question_type: str
    mc_preview: Optional[str] = None
    text: str
    source: str
    uploaded_at: datetime 
    reviewed: bool


# Class for new ALREADY-EDITED clean questions from frontend
class CleanQuestions(BaseModel):
    question_id: uuid.UUID
    section: str
    topic: str
    subtopic: List[str]
    difficulty: str
    time_estimate: int
    question_preview:str
    question_type: str
    mc_preview: str
    text: str
    equation: str
    diagram: str
    multiple_choices: Optional[dict]
    answer_key: Optional[Union[str, List[str]]]
    source: Optional[str] = None


# Class for new incoming clean questions from frontend
class AddQuestions(BaseModel):
    section: str
    topic: str
    subtopic: List[str]
    difficulty: str
    time_estimate: int
    question_preview: str
    question_type: str
    mc_preview: str
    text: str
    equation: str
    diagram: str
    multiple_choices: Optional[dict]
    answer_key: Optional[Union[str, List[str]]] = None
    source: str


class SearchRawQuestions(BaseModel):
    section: Optional[str] = None
    topic: Optional[str] = None
    subtopic: Optional[str] = None
