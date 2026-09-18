from app.core.database import Base
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func
from sqlalchemy.dialects.postgresql import JSONB
import uuid


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