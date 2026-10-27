from sqlalchemy.orm import Session 
import logging 

from app.core.logging_config import setup_logging
from app.domains.payments.models import UserAccess

setup_logging() 
logger = logging.getLogger("stripe-webhook")



def set_access_status(db: Session, clerk_id: str, status: str) -> None:
    """Update status on an existing entitlement only; never create a half-empty row. Does not commit."""
    entitlement = db.query(UserAccess).filter(UserAccess.clerk_id == clerk_id).first()
    if entitlement is None:
        logger.warning("No UserAccess row for clerk_id=%s; cannot set status=%s", clerk_id, status)
        return
    entitlement.status = status
    db.flush()