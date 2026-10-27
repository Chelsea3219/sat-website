from datetime import datetime, timezone
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import require_auth
from app.domains.payments.models import Payments


def require_paid_plan(
    clerk_id: str,
    db: Session,
) -> bool:
    """
    You must define the policy:
- A canceled subscription might retain access until the paid period ends.
- A failed renewal might retain access for a grace period.
- A fully expired subscription should lose access.
- A refunded or disputed payment may require a separate access-revocation policy.
    """
    
    sub = db.get(Payments, clerk_id)

    if not sub or not sub.expires_at:
        raise HTTPException(
            status_code=402,
            detail="subscription_required",
        )

    now = datetime.now(timezone.utc)

    if sub.expires_at <= now:
        raise HTTPException(
            status_code=402,
            detail="subscription_expired",
        )

    return sub