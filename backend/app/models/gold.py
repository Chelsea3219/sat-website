from sqlalchemy import Column, Integer, DateTime, String, func 
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid


from app.core.database import Base


class UserAnalytics(Base):
    __tablename__ = "user_analytics"
    __table_args__ = {"schema": "gold"}

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, nullable=False)
    type = Column(String, nullable=False)  # e.g., "quiz", "practice", "test"
    topic = Column(String, nullable=False) # e.g., "math", "reading", "overall"

    # mastey_score consists of raw, max, and mastery_score
    reading_mastery = Column(JSONB, nullable=True)  # Stores reading mastery data as JSON
    reading_topics_mastery = Column(JSONB, nullable=True)  # Stores reading subtopics data as JSON
    math_mastery = Column(JSONB, nullable=True)  # Stores math mastery data as JSON
    math_topics_mastery = Column(JSONB, nullable=True)  # Stores math subtopics data as JSON

    # List of subtopics that needs review
    weak_subtopics = Column(JSONB, nullable=True)  # Stores weak subtopics data as JSON
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())