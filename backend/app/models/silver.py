from app.core.database import Base
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
import uuid


class SilverUsers(Base):
    __tablename__ = "silver_users"
    __table_args__ = {"schema":"silver"}

    clerk_id = Column(String, ForeignKey("bronze.bronze_users.clerk_id"), nullable=False, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    grade_level = Column(String, nullable=False)
    school = Column(String, nullable=False)
    state = Column(String, nullable=False)
    email = Column(String, nullable=False)

    original_score = Column(JSONB, nullable=False)
    dream_score = Column(Integer, nullable=False)
    test_date = Column(Date, nullable=True)
    learning_targets = Column(JSONB, nullable=True)

    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    subscription = Column(String, nullable=False)


class TestScores(Base):
    __tablename__ = "test_scores"
    __table_args__ = {"schema":"silver"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, ForeignKey("bronze.bronze_users.clerk_id"), nullable=False, primary_key=True)
    current_score = Column(JSONB, nullable=False)
    dream_score = Column(Integer, nullable=False)
    test_date = Column(Date, nullable=True)
    type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


