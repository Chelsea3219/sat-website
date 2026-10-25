import logging
import stripe
from datetime import datetime, timedelta, timezone, UTC
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session


from app.core.config import settings
from app.core.database import get_db
from app.domains.errors.error_handler import handle_db_errors
from app.domains.payments.models import Payments, UserAccess
from app.domains.database.upsert import upsert



logger = logging.getLogger("stripe-webhook")
router = APIRouter(prefix="/api/stripe", tags=["stripe"])


PLAN_DAYS = {"monthly": 31, "three_months": 92, "six_months": 183}


@router.post("/webhook")
async def stripe_webhook(request: Request, db=Depends(get_db)):
    payload = await request.body()  # must be the raw body for signature checking
    sig = request.headers.get("stripe-signature")
    now = datetime.now(UTC)

    # Verfying that the event came from Stripe 
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    obj = event["data"]["object"].to_dict()
    session_id = obj.get("id")
    event_type = event["type"]

    if event_type == "checkout.session.completed":
        logger.info(
            "Checkout completed: session=%s mode=%s payment_status=%s "
            "customer=%s metadata=%s",
            obj.get("id"),
            obj.get("mode"),
            obj.get("payment_status"),
            obj.get("customer"),
            obj.get("metadata"),
        )
        
        # Active a prepaid pass: one-time, 3, or 6 month pass
        # TODO It still needs transaction handling, idempotency, and decisions about how prepaid access interacts with an existing recurring subscription.

        if obj["payment_status"] != "paid":
            return {"received": True}
        
        clerk_id = obj["metadata"].get("clerk_id")
        session_id = obj["id"]
        product_name = obj["metadata"].get("product_name")
        if not clerk_id:
            logger.error("Invalid product_name ")
            raise HTTPException(status_code=400, detail="Missing clerk_id")
        if product_name not in PLAN_DAYS:
            raise HTTPException(status_code=400, detail="Invalid product name")

        # Checks to see if the checkout is already recorded
        payment_exists = db.query(Payments).filter(Payments.session_id == session_id).first()
        if payment_exists:
            return {"received": True}

        entitlement = db.query(UserAccess).filter(UserAccess.clerk_id == clerk_id).first()
        current_end = (entitlement.current_plan_end if entitlement and entitlement.current_plan_end else now)
        expires_at = max(now, current_end) + timedelta(days=PLAN_DAYS[product_name])

        # Add a record to the Payments table
        with handle_db_errors(db, "record prepaid checkout"):
            fields = {
                "clerk_id":clerk_id, 
                "subscription_id": obj.get("subscription"), 
                "stripe_id": obj.get("customer"), 
                "stripe_price_id":obj["metadata"].get("price_id"), 
                "session_id": session_id,
                "product_name": product_name, 
                "status": "paid",
                "created_at":now 
            }
            # Updates the subscription in the db
            upsert(
                db=db, 
                model=Payments,
                lookup_field="session_id", 
                lookup_value=obj["id"], 
                **fields
            )
            if entitlement:
                entitlement.current_plan_end = expires_at
                entitlement.status = "active"
            else:
                entitlement = UserAccess(
                    clerk_id=clerk_id, 
                    current_plan=product_name,
                    status="active", 
                    current_plan_end=expires_at
                )
                db.add(entitlement)
            db.commit()
        logger.info("Payment completed: user=%s plan=%s", obj["client_reference_id"], obj["id"])


    elif event_type == "invoice.paid":
        # Activate or extend monthly access 
        # Monthly: first payment and every renewal
        """period_end = obj["lines"]["data"][0]["period"]["end"]
            upsert(db, clerk_id_for(obj["customer"]),
            plan="monthly", status="active",
            expires_at=datetime.fromtimestamp(period_end, timezone.utc),
            stripe_customer_id=obj["customer"])"""
        logger.info("Invoice paid: subscription=%s", obj.get("subscription"))


    elif event_type == "invoice.payment_failed":
        # Mark the subscription as past_due
        # Card declined; Stripe will retry. Keep access until expires_at, but flag it.
        """upsert(db, clerk_id_for(obj["customer"]), status="past_due")"""

    elif event_type == "customer.subscription.deleted":
        # Mark the subscription as canceled
        # Canceled, or all payment retries failed. Access runs until expires_at, then stops.
        """upsert(db, clerk_id_for(obj["customer"]), status="canceled")"""
        logger.info("Subscription canceled: %s", obj["id"])

    return {"received": True}