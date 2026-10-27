import logging
import stripe
from typing import Annotated
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from clerk_backend_api.security.types import RequestState

from app.core.config import settings
from app.core.database import get_db
from app.core.auth import require_auth
from app.core.logging_config import setup_logging

from app.domains.errors.error_handler import handle_db_errors
from app.domains.payments.models import Payments
from app.domains.students.models import SilverUsers, BronzeUsers
from app.domains.database.upsert import upsert
from app.domains.payments.services.products import PRODUCTS
from app.domains.students.services.fetch_student_info import fetch_student_info



setup_logging()
logger = logging.getLogger("stripe-webhook")
router = APIRouter(prefix="/api/stripe", tags=["stripe"])

stripe.api_key = settings.STRIPE_SECRET_KEY
frontend_URL = settings.FRONTEND_URL.rstrip('/')
PLAN_DAYS = {"monthly": 31, "three_months": 92, "six_months": 183}


class CheckoutRequest(BaseModel):
    product: str

@router.post("/checkout")
async def create_checkout_session(
    payload:CheckoutRequest,
    state: Annotated[RequestState, Depends(require_auth)], 
    db= Depends(get_db)
):  
    clerk_id = state.payload["sub"]
    email = state.payload.get("email")

    config = PRODUCTS.get(payload.product)
    if not config:
        raise HTTPException(status_code=400, detail="Invalid product purchase.")
    price_id = config["price_id"]
    if not price_id:
        raise HTTPException(status_code=500, detail="Stripe price is not configured.")

    try:
        # Search for the stripe customer id. If it does not exist, create one
        student_info = fetch_student_info(clerk_id, db)
        if student_info and student_info.stripe_id:
            customer_id = student_info.stripe_id
        else:
            customer =  stripe.Customer.create(metadata={"email": email, "clerk_id": clerk_id})
            customer_id = customer.id
            fields = {
                "email": email, "clerk_id": clerk_id, "stripe_id": customer_id, 
            }
            with handle_db_errors(db, "sync student's information in the bronze and silver tables"):
                upsert(db, BronzeUsers, "clerk_id", fields.get("clerk_id"), stripe_id=customer_id)
                upsert(db, SilverUsers, "clerk_id", fields.get("clerk_id"), stripe_id=customer_id)
            db.commit()
            logger.info("Checkout session created: user=%s plan=%s stripe_id=%s", clerk_id, payload.product, customer_id)


        metadata = {
            "clerk_id": clerk_id, 
            "product_name": payload.product, 
            "price_id": price_id
        }

        session_parameters = {
            "mode": config["mode"], 
            "customer": customer_id, 
            "line_items": [{ "price": price_id, "quantity": 1 }], # Defined the priceId and the quality being purchased
            "client_reference_id": clerk_id,   # Adds the clerk id as a reference for the checkout session
            "metadata": metadata,  # Stores your plan key and Clerk ID for later processing
            "success_url": (
                f"{frontend_URL}/register"
                f"?checkout=success&purchase={payload.product}"
            ),
            "cancel_url": f"{frontend_URL}/pricing",
        }
        if config["mode"] == "subscription":
            session_parameters["subscription_data"] = {"metadata": metadata}
        
        #logger.info("Checkout success_url: %s", session_parameters.get("success_url"))
        
        session = stripe.checkout.Session.create(**session_parameters)
        return {"url": session.url }
    except stripe.StripeError:
        logger.exception("Stripe checkout creation failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to create checkout session.",
        )

    except Exception:
        db.rollback()
        logger.exception("Checkout creation failed")
        raise HTTPException(
            status_code=500,
            detail="Failed to create checkout session.",
        )