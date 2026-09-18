# Import Python libraries and files 
from sqlalchemy import Column, Integer, DateTime, String, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from app.core.database import Base
from app.domains.questions.services.topic import reading_topics, math_topics


class QuestionAttempts(Base):
    __tablename__ = "question_attempts"
    __table_args__ = {"schema": "silver"}

    # Identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String, nullable=False)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    question_id = Column(String, ForeignKey("silver.silver_questions.question_id"), nullable=False)
    session_type = Column(String, nullable=False)

    difficulty = Column(String, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_elapsed = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class SilverAnalytics(Base):
    __tablename__ = "quiz_analytics"
    __table_args__ = {"schema": "silver"}

    session_id = Column(String, primary_key=True)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    section = Column(String, nullable=True) # e.g., "math", "reading", "overall"

    # mastey_score consists of raw, max, and mastery_score
    section_mastery = Column(JSONB, nullable=True)  # Stores section mastery data as JSON
    topics_mastery = Column(JSONB, nullable=True)  # Stores topics mastery data as JSON

    # List of subtopics that needs review
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class GoldAnalytics(Base):
    __tablename__ = "quiz_analytics"
    __table_args__ = {"schema": "gold"}

    session_id = Column(String)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"),primary_key=True)

    # mastey_score consists of raw, max, and mastery_score
    reading_mastery = Column(JSONB, nullable=False)   
    reading_topics_mastery = Column(JSONB, nullable=False)   
    math_mastery = Column(JSONB, nullable=False)  
    math_topics_mastery = Column(JSONB, nullable=False)  

    # List of subtopics that needs review
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class SilverSubtopicMasteryModel(Base):
    __tablename__ = "practice_analytics"
    __table_args__ = {"schema": "silver"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String, nullable=False)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    section = Column(String, nullable=False)  # e.g., "math", "reading"
    topic = Column(String, nullable=False)
    subtopic = Column(String, nullable=False)
    mastery_score = Column(JSONB, nullable=False)
    questions_answered = Column(JSONB, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    avg_time_elapsed = Column(Integer, nullable=True)  # Average time elapsed in seconds
    status = Column(String, nullable=False) # needs_review, improving, or mastered


class GoldSubtopicMastery(Base):
    __tablename__ = "practice_analytics"
    __table_args__ = {"schema": "gold"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String, nullable=False)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    section = Column(String, nullable=False)  # e.g., "math", "reading"
    topic = Column(String, nullable=False)
    subtopic = Column(String, nullable=False)
    mastery_score = Column(JSONB, nullable=False)
    questions_answered = Column(JSONB, nullable=False)
    last_wrong_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    avg_time_elapsed = Column(Integer, nullable=True)  # Average time elapsed in seconds
    status = Column(String, nullable=False) # needs_review, improving, or mastered