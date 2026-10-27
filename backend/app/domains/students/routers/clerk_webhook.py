import logging
import json
from typing import Annotated
from datetime import datetime, timedelta, timezone, UTC 
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session

from svix.webhooks import Webhook, WebhookVerificationError

from clerk_backend_api.security.types import RequestState

from app.core.config import settings
from app.core.auth import require_auth
from app.core.logging_config import setup_logging
from app.core.database import get_db

from app.domains.database.upsert import upsert
from app.domains.errors.error_handler import handle_db_errors
from app.domains.students.models import BronzeUsers, SilverUsers
from app.domains.payments.models import Payments, UserAccess



setup_logging() 
logger = logging.getLogger("clerk-webhook")
router = APIRouter(prefix="/api/clerk", tags=["students"])



@router.post("/webhook")
async def clerk_webhook(
    request: Request,
    db:Session =Depends(get_db)
):
    logger.info("Stripe webhook endpoint was reached")

    # Verify that the request before trusting its contents 
    webhook_key = settings.CLERK_WEBHOOK
    if not webhook_key:
        logger.error("Clerk webhook secret key is not configured.")
        raise HTTPException(status_code=500, detail="Webhook configuration error.")

    raw_body = await request.body()

    try:
        Webhook(webhook_key).verify(raw_body, request.headers)
    except Exception as e:
        logger.warning("Clerk webhook signation verification failed")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # Determine the event and its parameters 
    event = json.loads(raw_body)
    event_type = event.get("type")
    user_data = event.get("data", {})
    now = datetime.now(UTC)

    # Ckecks to see if user exists in bronze or silver tables. If not, create and add new record
    if event_type in ("user.created", "user.updated"):
        if not user_data.get("id"):
            raise HTTPException(status_code=400, detail="Missing Clerk ID")

        email_addresses = user_data.get("email_addresses") or []
        primary_email_id = user_data.get("primary_email_address_id")
        email = next(
            (address.get("email_address") for address in email_addresses if address.get("id") == primary_email_id), None
        )
        clerk_id = user_data.get("id")
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")

        with handle_db_errors(db, "sync Clerk user in the bronze and silver tables"):
            upsert(
                db = db, 
                model = BronzeUsers, 
                create_only={"created_at":now, "role": "student"}, 
                lookup_field = "clerk_id", 
                lookup_value = clerk_id,
                email=email,
                first_name=first_name, 
                last_name=last_name
            )
            upsert(
                db = db, 
                model = SilverUsers,
                lookup_field = "clerk_id", 
                lookup_value = clerk_id, 
                create_only={"role": "student"}, 
                email=email,
                first_name=first_name, 
                last_name=last_name,
                updated_at=now 
            )
            upsert(
                db=db, 
                model=UserAccess, 
                lookup_field="clerk_id", 
                lookup_value=clerk_id, 
                create_only={ "current_plan":"free", "current_plan_end":now, "status":"active"},
            )
        db.commit()
        logger.info("Successfully synced Clerk user %s to BronzeUser and SilverUsers", clerk_id)
        return {"received": True, "event": event_type}

    
    elif event_type == "user.deleted":
        clerk_id = user_data.get("id")

        if not clerk_id:
            raise HTTPException(
                status_code=400,
                detail="Missing Clerk user ID",
            )

        # TODO: Apply your account-deletion policy.
        # Consider soft deletion and retaining billing records
        # where required. Do not recreate this user from a late
        # user.created or user.updated event.

        logger.info("Clerk user deletion received: %s", clerk_id)

        return {
            "received": True,
            "event": event_type,
        }

    # Other event types aren't relevant to this handler yet.
    return {
        "received": True,
        "event": event_type,
        "handled": False,
    }