from sqlalchemy import Column, Integer, DateTime, String, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from app.core.database import Base


class GoldAnalytics(Base):
    __tablename__ = "gold_analytics"
    __table_args__ = {"schema": "gold"}

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    type = Column(String, nullable=False)  # e.g., "quiz", "practice", "test"
    focus = Column(String, nullable=False) # e.g., "math", "reading", "overall"

    # mastey_score consists of raw, max, and mastery_score
    reading_mastery = Column(JSONB, nullable=True)  # Stores reading mastery data as JSON
    reading_topics_mastery = Column(JSONB, nullable=True)  # Stores reading subtopics data as JSON
    math_mastery = Column(JSONB, nullable=True)  # Stores math mastery data as JSON
    math_topics_mastery = Column(JSONB, nullable=True)  # Stores math subtopics data as JSON

    # List of subtopics that needs review
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class GoldSubtopicMastery(Base):
    __tablename__ = "gold_subtopic_mastery"
    __table_args__ = {"schema": "gold"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, ForeignKey("silver.silver_users.clerk_id"), nullable=False)
    section = Column(String, nullable=False)  # e.g., "math", "reading"
    subtopic = Column(String, nullable=False)
    mastery_score = Column(JSONB, nullable=False)
    questions_answered = Column(JSONB, nullable=False)
    last_wrong_at = Column(DateTime(timezone=True), nullable=True, server_default=func.now())
    avg_time_elapsed = Column(Integer, nullable=True)  # Average time elapsed in seconds
    status = Column(String, nullable=False) # needs_review, improving, or mastered
