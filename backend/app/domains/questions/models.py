# Import Python libraries 
from sqlalchemy import Column, DateTime, Integer, String, UUID, Date, Boolean, Text, func
from sqlalchemy.dialects.postgresql import JSONB
import uuid

from app.core.database import Base


class BronzeQuestions(Base):
    """Bronze Questions: questions from various workbooks/worksheets without any edits. """
    __tablename__ = "bronze_questions"
    __table_args__ = {"schema": "bronze"}

    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    subtopic = Column(String, nullable=True)

    question_preview = Column(String, nullable=True)
    question_type = Column(String, nullable=False)
    mc_preview = Column(String, nullable=True)
    text = Column(String, nullable=False)

    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    source = Column(String, nullable=False)
    reviewed = Column(Boolean, nullable=False)



class SilverQuestions(Base):
    """Silver Questions: questions that has been edited with the added MCs or diagrams/equations. """
    __tablename__ = "silver_questions"
    __table_args__ = {"schema": "silver"}

    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    section = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    subtopic = Column(JSONB, nullable=True) # returns as list

    difficulty = Column(String, nullable=False)
    time_estimate = Column(Integer)

    question_preview = Column(Text, nullable=True)
    question_type = Column(String, nullable=False)
    mc_preview = Column(Text, nullable=True)

    text = Column(Text, nullable=False)
    equation = Column(Text)
    diagram = Column(Text)
    multiple_choices = Column(JSONB(none_as_null=True)) # returns as dict 
    
    answer_key = Column(String)

    updated_at = Column(Date, nullable=False) # returns datetime
    explanation_status = Column(String, nullable=False)
