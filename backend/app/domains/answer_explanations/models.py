# Import Python libraries 
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func
from sqlalchemy.dialects.postgresql import JSONB
import uuid

from app.core.database import Base


class SilverHintsAnswerExplanations(Base):
    """Silver Hints and Answer Explanations: hints and answer explanations for questions that has been edited with the added MCs or diagrams/equations. """
    __tablename__ = "hints_answer_explanations"
    __table_args__ = {"schema": "silver"}

    answer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), nullable=False)

    answer_key = Column(String, nullable=False)
    answer_explanation = Column(Text, nullable=True)

    hint_1 = Column(Text, nullable=True)
    hint_2 = Column(Text, nullable=True)
    hint_3 = Column(Text, nullable=True)

    status = Column(String, nullable=False, default="pending_review")
    model_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())