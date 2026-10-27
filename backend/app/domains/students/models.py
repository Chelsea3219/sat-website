from app.core.database import Base
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
import uuid


class BronzeUsers(Base):
    __tablename__ = "bronze_users"
    __table_args__ = {"schema":"bronze"}

    clerk_id = Column(String, nullable=False, primary_key=True)
    stripe_id = Column(String, nullable=True, unique=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)

    grade_level = Column(String, nullable=True)
    school = Column(String, nullable=True)
    state = Column(String, nullable=True)

    original_score = Column(JSONB, nullable=True)
    dream_score = Column(Integer, nullable=True)
    test_date = Column(Date, nullable=True)
    learning_targets = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    referral = Column(String, nullable=True)
    role = Column(String, nullable=True)
    

class SilverUsers(Base):
    __tablename__ = "silver_users"
    __table_args__ = {"schema":"silver"}

    clerk_id = Column(String, ForeignKey("bronze.bronze_users.clerk_id"), nullable=False, primary_key=True)
    stripe_id = Column(String, nullable=True, unique=True)
    role = Column(String)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)

    grade_level = Column(String, nullable=True)
    school = Column(String, nullable=True)
    state = Column(String, nullable=True)
    email = Column(String, nullable=True)

    original_score = Column(JSONB, nullable=True)
    dream_score = Column(Integer, nullable=True)
    test_date = Column(Date, nullable=True)
    learning_targets = Column(JSONB, nullable=True)

    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


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