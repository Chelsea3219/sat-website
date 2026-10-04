# Import Python libraries and files 
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, Dict, List
from datetime import date, datetime
from uuid import UUID


class QuestionsAnswered(BaseModel):
    num_incorrect: int
    num_questions: int


class QuestionStats(BaseModel):
    num_questions: int
    num_correct: int
    time_spent: int 


class IncomingAnswerSheet(BaseModel):
    clerk_id: str 
    session_id: str
    question_id: UUID
    question_type: str
    section: str
    topic: str
    subtopic: List[str]
    difficulty: str
    answer: Optional[str] = None 
    is_correct: bool
    time_elapsed: int
    completed_at: datetime 


class IncomingPracticeSheet(IncomingAnswerSheet):
    answer_attempts: List[str]
    num_hints: int


class QuestionAttempts(BaseModel):
    id: UUID
    session_id: str
    clerk_id: str 
    question_id: UUID 
    type: str
    difficulty: str
    is_correct: bool
    time_elapsed: int
    completed_at: datetime 


class MasteryScore(BaseModel):
    raw_score: float
    max_score: float
    mastery_score: float 


class SilverAnalytics(BaseModel):
    session_id: str
    clerk_id: str
    section: str
    section_mastery: MasteryScore
    topics_mastery: Dict[str, MasteryScore]


class IncomingSilverAnalytics(SilverAnalytics):
    completed_at: datetime 


class IncomingGoldAnalytics(BaseModel):
    session_id: str
    clerk_id: str
    reading_mastery: MasteryScore
    reading_topics_mastery: Dict[str, MasteryScore]
    math_mastery: MasteryScore
    math_topics_mastery: Dict[str, MasteryScore]
    completed_at: datetime


class BaseSubtopicMastery(BaseModel):
    section: str
    topic: str
    subtopic: str
    mastery_score: MasteryScore
    questions_answered: QuestionsAnswered
    avg_time_elapsed: int
    status: str


class SilverSubtopicMastery(BaseSubtopicMastery):
    completed_at: datetime 


class IncomingGoldSubtopicMastery(BaseSubtopicMastery):
    last_wrong_at: datetime


class PracticeSessionSummary(BaseModel):
    current_subtopic_mastery: BaseSubtopicMastery
    updated_subtopic_mastery: Optional[BaseSubtopicMastery] = None 

class SubtopicSummary(BaseModel):
    current_subtopic_mastery: dict
    updated_subtopic_mastery: dict

class PracticeGradeResponse(BaseModel):           # overall score for this set
    subtopics: Dict[str, SubtopicSummary]

class QuizSubtopicMastery (BaseModel):
    section: str
    topic: str
    subtopic: str
    mastery_score: MasteryScore
    questions_answered: QuestionsAnswered
    avg_time_elapsed: int 
    status: str


class QuizResultsBreakdown(BaseModel):
    section_mastery: MasteryScore
    topic_mastery: Dict[str, MasteryScore]
    subtopic_mastery: List[QuizSubtopicMastery]


class PastQuizAnalytics(BaseModel):
    past_quizzes: List[IncomingSilverAnalytics]
    num_quizzes: int 