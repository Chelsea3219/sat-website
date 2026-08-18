from app.core.database import Base
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func
from sqlalchemy.dialects.postgresql import JSONB
import uuid


class BronzeUsers(Base):
    __tablename__ = "bronze_users"
    __table_args__ = {"schema":"bronze"}

    clerk_id = Column(String, nullable=False, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)

    grade_level = Column(String, nullable=False)
    school = Column(String, nullable=False)
    state = Column(String, nullable=False)

    original_score = Column(JSONB, nullable=False)
    dream_score = Column(Integer, nullable=False)
    test_date = Column(Date, nullable=True)
    learning_targets = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    subscription = Column(String, nullable=False)
    referral = Column(String, nullable=True)
    role = Column(String, nullable=False)



class ContactMessages(Base):
    __tablename__ = "contact_messages"
    __table_args__ = {"schema": "bronze"}

    message_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())