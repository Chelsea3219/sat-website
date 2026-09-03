from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import func
from helpers import logger
from html import escape # prevents the browser from intepreting user data or raw text as executable HTML code 

from app.core.database import get_db
from app.core.config import settings
from app.domains.errors.error_handler import handle_db_errors
from app.models.bronze import ContactMessages
from app.schemas.marketing import ContactUsForm

import resend
resend.api_key = settings.RESEND_API_KEY

router = APIRouter(prefix="/api/landing", tags=["landing"])

@router.post("/contact-us")
async def upload_contact_form(payload:ContactUsForm, db: Session = Depends(get_db) ):

    # Adds the message to the bronze schema
    message = ContactMessages(
        full_name = payload.full_name,
        email = payload.email,
        role = payload.role, 
        subject = payload.subject, 
        message = payload.message, 
        sent_at = func.now()
    )
    with handle_db_errors(db, context="saving contact message"):
        db.add(message)
        db.commit()

    
    # Send the email to the business email 
    try:
        # Format HTML body
        content = f"""
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> {escape(payload.full_name)}</p>
        <p><strong>Email:</strong> {escape(payload.email)}</p>
        <p><strong>Role:</strong> {escape(payload.role)}</p>
        <p><strong>Subject:</strong> {escape(payload.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>{escape(payload.message)}</p>
        """

        params: resend.Emails.SendParams = {
            "from": "Contact Form <onboarding@resend.dev>", #TODO change domain when no longer in testing
            "to" : ["cdzebaze@gmail.com"],
            "reply_to" : payload.email, 
            "subject" : f"Contact Form : {payload.subject}",
            "html": content
        }
        await resend.Emails.send_async(params)
    except Exception as e:
        logger.error(f"Email delivery failed through Resend : {str(e)}")
        raise HTTPException(status_code=500, detail="Message saved, but email notification failed.")

    return {"status": "success", "detail": "Message saved and email sent successfully."}