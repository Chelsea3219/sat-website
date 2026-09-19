# Import Python libraries and files 
import os
import logging
import tempfile
from typing import List
from fastapi import APIRouter, Form, UploadFile, HTTPException

from app.domains.document_processing.schemas import UploadRawQuestions 
from app.domains.document_processing.pipelines.extraction.extract_pp import extract_text_pp
from app.domains.document_processing.pipelines.clean import normalize_questions, mcq_diagram_identifier
from app.domains.document_processing.pipelines.upload_images import upload_image_to_cloudinary

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/document-processing", tags=["document-processing"])


# UPLOAD PDFs & WORKBOOKS TO EXTRACT QUESTIONS AND MCS -----------------------------------------------------------------
@router.post("/extract-questions", response_model=List[UploadRawQuestions])
async def extract_text(
        file: UploadFile,
        section: str = Form(...),
        topic: str = Form(...),
        subtopic: str = Form(...),
        source: str = Form(...)
):
    text = await file.read()
    extracted_questions = [] # just in case, there is an error
    try:
        # Save to temp file so your function gets the path it expects
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(text)
            tmp_path = tmp.name

        # Extract the text
        if source == "preppros":
            extracted_questions = extract_text_pp(tmp_path, section, topic, subtopic, source)

            # Clean the text
            normalized_questions = normalize_questions(extracted_questions)
            organized_questions = mcq_diagram_identifier(normalized_questions)

            #Upload the images to cloudinary
            questions = upload_image_to_cloudinary(organized_questions, section, topic, subtopic)
        else:
            return {"success": False, "error":"Source not supported"}

        return questions

    except Exception as e:
        logger.error(f"Unexpected error during questions extraction : {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error during questions extraction")
    finally:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)