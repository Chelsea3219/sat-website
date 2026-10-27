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
    type: Literal["concept", "calculation", "reasoning", "evidence", "verification", "desmos"]
    title:str
    content: List[ExplanationContent]


class AnswerExplanation(BaseModel):
    description: str
    steps: List[ExplanationSteps]


class GeneratedAnswerExplanations(BaseModel):
    answer_key: str = Field(description="Single letter A-D for multiple choice; number or text for free response.")
    ai_answer_explanation: AnswerExplanation

    hint_1: str = Field(description="Math: the key word/statement in the question. Reading: the key phrase or sentence in the passage. Must not reveal the answer.")
    hint_2: Optional[str] = Field(None, description="Math only: the relevant formula/strategy and how it connects to hint 1. Omit for reading. Must not reveal the answer.")




class OutgoingAnswerExplanations(GeneratedAnswerExplanations):
    question_id: UUID

    status: Optional[Literal["generating", "pending_review", "approved", "rejected", "needs_review"]] = "pending_review"
    model_name: str
    created_at: datetime 


