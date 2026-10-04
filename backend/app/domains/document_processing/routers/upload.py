# Import Python libraries and files 
import logging
from datetime import datetime
from typing import List
import cloudinary.uploader
from fastapi import APIRouter, Form, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session

from app.domains.errors.error_handler import handle_db_errors
from app.domains.document_processing.schemas import UploadRawQuestions 
from app.domains.document_processing.pipelines.extraction.extract_pp import extract_text_pp
from app.domains.document_processing.pipelines.clean import normalize_questions, mcq_diagram_identifier, normalize_text
from app.domains.document_processing.pipelines.upload_images import upload_image_to_cloudinary

from app.core.database import get_db
from app.domains.questions.models import BronzeQuestions, SilverQuestions


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# BULK UPLOAD THE EXTRACTED QUESTIONS INTO BRONZE QUESTIONS TABLE
@router.post("/bulk-upload-questions")
async def bulk_upload(payload:List[UploadRawQuestions], db: Session = Depends(get_db)):
    skipped = []
    added = []

    with handle_db_errors(db, "uploading raw questions into the BronzeQuestions table"):
        for q in payload:
            # Checks to see if the questions are in the dataframe already
            db_question = db.query(BronzeQuestions).filter(BronzeQuestions.text == q.text).first()
            if db_question:
                skipped.append(q.text)
                continue # Skips question

            question = BronzeQuestions(
                section = q.section,
                topic = q.topic,
                subtopic=q.subtopic.lower(),
                question_preview= q.question_preview,
                question_type=q.question_type,
                mc_preview = q.mc_preview,
                text = q.text,
                uploaded_at= datetime.now(),
                source=q.source,
                reviewed=False
            )
            db.add(question)
            added.append(q.text)

        db.commit()
        return { "success": True, "num_questions_added" : len(added)}


# UPLOAD THE QUESTION IMAGE FROM THE FRONTEND TO CLOUDINARY
@router.post("/upload-question-image")
async def upload_question_image(
    image: UploadFile,
    section: str = Form(...),
    topic: str = Form(...),
    subtopic: str = Form(...),
    category: str = Form(...)
):
    section = normalize_text(section)
    topic = normalize_text(topic)
    subtopic = normalize_text(subtopic)
    try:
        content = await image.read()

        result = cloudinary.uploader.upload(
            content,
            folder=f"sat_questions/{section}/{topic}/{subtopic}/{category}",
            overwrite=True,
            resource_type='image',
        )
        return {"success": True, "url": result["secure_url"]}
    except Exception as e:
        logger.error(f"Unexpected error during question image upload: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error during question image upload")

