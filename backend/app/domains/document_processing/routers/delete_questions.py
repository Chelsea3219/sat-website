# Import Python libraries and files 
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.domains.errors.error_handler import handle_db_errors
from app.domains.questions.models import BronzeQuestions



router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


@router.delete("/delete-questions/{question_id}")
def delete_questions(question_id: str, db=Depends(get_db)):
    with handle_db_errors(db, "deleting question"):
        question = db.query(BronzeQuestions).filter(BronzeQuestions.question_id == question_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        db.delete(question)
        db.commit()
        return {"message": "Question deleted successfully"}