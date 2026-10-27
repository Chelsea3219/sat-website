
from datetime import datetime, UTC 


def as_aware(dt: datetime | None) -> datetime | None:
    """Treat naive datetimes from the DB as UTC so they can be compared with datetime.now(UTC)."""
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)
    return dt



def get_metadata(event_type: str, obj: dict) -> dict:
    """Each event type carries metadata in a different place.
    - Checkout Session / Subscription: on the object itself
    - Invoice: copied from the subscription (requires `subscription_data.metadata` at checkout)"""
    if event_type.startswith("invoice."):
        return get_subscription_details(obj).get("metadata") or {}
    return obj.get("metadata") or {}


def get_subscription_details(obj: dict) -> dict:
    """Invoices keep subscription info under `parent.subscription_details` (newer API versions)
    or `subscription_details` (older ones)."""
    return (obj.get("parent") or {}).get("subscription_details") or obj.get("subscription_details") or {}


def get_subscription_id(event_type: str, obj: dict) -> str | None:
    if event_type.startswith("customer.subscription."):
        return obj.get("id")
    details = (obj.get("parent") or {}).get("subscription_details") or {}
    return details.get("subscription") or obj.get("subscription")