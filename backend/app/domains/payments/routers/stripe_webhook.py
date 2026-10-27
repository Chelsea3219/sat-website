import logging
import stripe
from datetime import datetime, timedelta, UTC
from fastapi import APIRouter, Request, HTTPException, Depends

from app.core.config import settings
from app.core.database import get_db
from app.core.logging_config import setup_logging
from app.domains.errors.error_handler import handle_db_errors
from app.domains.payments.models import Payments, UserAccess
from app.domains.database.upsert import upsert
from app.domains.payments.services.logger_scripts import is_checkout_complete
from app.domains.payments.services.helpers import get_metadata, get_subscription_id
from app.domains.payments.services.set_access_status import set_access_status


setup_logging()
logger = logging.getLogger("stripe-webhook")
router = APIRouter(prefix="/api/stripe", tags=["stripe"])
HANDLED_EVENTS = ["checkout.session.completed", "invoice.paid", "invoice.payment_failed", "customer.subscription.deleted"]
PLAN_DAYS = {"monthly": 31, "three_months": 92, "six_months": 183}



@router.post("/webhook")
async def stripe_webhook(request: Request, db=Depends(get_db)):
    payload = await request.body()  # must be the raw body for signature checking
    sig = request.headers.get("stripe-signature")
    now = datetime.now(UTC)

    # Verfying that the event came from Stripe ------------------------------------------------------------------------------------------------------
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")


    # Determine the parameters -----------------------------------------------------------------------------------------------------------------------
    obj = event["data"]["object"].to_dict()
    record_id = obj.get("id")
    event_type = event["type"]

    metadata = get_metadata(event_type, obj)
    product_name = metadata.get("product_name")
    clerk_id = obj.get("reference_id") or metadata.get("clerk_id")


    # Error Handling -----------------------------------------------------------------------------------------------------------------------
    if event_type not in HANDLED_EVENTS:
        return {"received": True, "ignored": True}
    if not clerk_id:
        logger.error("Missing clerk id")
        raise HTTPException(status_code=400, detail="Missing clerk_id")
    if product_name not in PLAN_DAYS:
        raise HTTPException(status_code=400, detail="Invalid product name")


    # Checks to see if the checkout is already recorded -------------------------------------------------------------------------------------
    # Idempotency: Stripe can deliver the same event more than once
    # TODO change to event_id = event["id"] and create a table called ProcessedEvent to save processed webhook events and it they were successful or a failure
    payment_exists = db.query(Payments).filter(Payments.record_id == record_id).first()
    if payment_exists:
        return {"Payment recorded already.": True}


    # Decides what this event should do before touching the DB ------------------------------------------------------------------------------
    grants_access = event_type == "invoice.paid" or (
        event_type == "checkout.session.completed"
        and obj.get("mode") == "payment"      # one-time plans only
        and obj.get("payment_status") == "paid"
    )

    # ------------------------------------------------------------------------------------------------------------------------------------------------\
    with handle_db_errors(db, f"stripe webhook {event_type}"):
        if grants_access:
            subscription_id = get_subscription_id(event_type, obj)

            # Add the data in the payments table 
            upsert(
                db=db, 
                model=Payments, 
                lookup_field="record_id", 
                lookup_value=record_id, 
                create_only={
                    "clerk_id": clerk_id, 
                    "subscription_id": subscription_id, 
                    "stripe_id": obj.get("customer"), 
                    "stripe_price_id": metadata.get("price_id"),
                    "product_name" : product_name, 
                    "status":"paid", 
                    "created_at": now
                }
            )
            #logger.info("payments was added successfully to table")
            
            # Update the user access in the UserAccess table if is the renewal monthly pass or the three/siz months purchase
            if product_name in PLAN_DAYS.keys():
                entitlement = db.query(UserAccess).filter(UserAccess.clerk_id == clerk_id).first()
                current_end = (entitlement.current_plan_end if entitlement and entitlement.current_plan_end else now)
                expires_at = max(now, current_end) + timedelta(days=PLAN_DAYS[product_name])

                upsert(
                    db=db, 
                    model=UserAccess, 
                    lookup_field="clerk_id", 
                    lookup_value=clerk_id, 
                    current_plan=product_name,
                    status="active", 
                    current_plan_end=expires_at, 
                    record_id=record_id,
                )

            db.flush()
            #logger.info("Access granted: user=%s plan=%s record=%s", clerk_id, product_name, obj["id"])

        elif event_type == "invoice.payment_failed":
            # Card declined; Stripe will retry. Keep access until current_plan_end, but flag it
            set_access_status(db, clerk_id, "past_due")
            logger.info("Payment failed: user=%s invoice=%s", clerk_id, obj["id"])

        elif event_type == "customer.subscription.deleted":
            # Canceled, or all retries failed. Access runs until current_plan_end, then stops.
            set_access_status(db, clerk_id, "canceled")
            logger.info("Subscription canceled: user=%s subscription=%s", clerk_id, obj["id"])

        db.commit()
    return {"received": True}