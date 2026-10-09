# Import Python libraries and files 
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, List, Dict 
from datetime import date, datetime
from uuid import UUID


"""
    Structures the answer explanations and hints for questions, including the answer key, explanation, and hints.
{
  "description": "Solving the equation",
  "steps": [
    {
      "step_number": 1,
      "type": "concept",
      "title": "Identify the equation",
      "content": [
        {
          "type": "text",
          "value": "Identify the variable you need to isolate."
        }
      ]
    },
    {
      "step_number": 2,
      "type": "calculation",
      "title": "Isolate the variable",
      "content": [
        {
          "type": "text",
          "value": "Apply the same operation to both sides."
        },
        {
          "type": "latex",
          "value": "2x + 4 = 12"
        }
      ]
    },
  ]
}
"""
class ExplanationContent(BaseModel):
    type: Literal["text", "latex", "image"]
    value: str


class ExplanationSteps(BaseModel):
    step_number: int
    type: Literal["concept", "calculation", "reasoning", "evidence", "verification"]
    title:str
    content: List[ExplanationContent]


class AnswerExplanations(BaseModel):
    description: str
    steps: List[ExplanationSteps]


class HintsAnswerExplanations(BaseModel):
    answer_id: UUID
    question_id: UUID

    answer_key: str
    answer_explanation: Optional[str] = None

    hint_1: Optional[str] = None
    hint_2: Optional[str] = None
    hint_3: Optional[str] = None

    status: Optional[Literal["pending_review", "approved", "rejected"]] = "pending_review"
    model_name: str
    created_at: Optional[datetime] = None


