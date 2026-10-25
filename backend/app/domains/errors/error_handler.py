import logging
from contextlib import contextmanager
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError, OperationalError

from app.core.logging_config import setup_logging

setup_logging()
logger = logging.getLogger("db_error")


def _safe_rollback(db: Session) -> None:
    try:
        db.rollback()
    except Exception:
        logger.warning("Rollback failed (connection may already be closed)", exc_info=True)


@contextmanager
def handle_db_errors(db: Session, context: str = "database operation"):
    """For FastAPI routes: rolls back and converts DB errors into HTTP responses."""
    try:
        yield
    except HTTPException:
        _safe_rollback(db)
        raise                                   # keep deliberate 404s, 403s, etc.
    except IntegrityError as e:
        _safe_rollback(db)
        logger.error("Integrity error during %s", context, exc_info=True)
        raise HTTPException(status_code=400, detail="Invalid data submitted.") from e
    except OperationalError as e:
        _safe_rollback(db)
        logger.error("Operational error during %s", context, exc_info=True)
        raise HTTPException(status_code=503, detail="Database temporarily unavailable.") from e
    except SQLAlchemyError as e:
        _safe_rollback(db)
        logger.exception("Database error during %s", context)
        raise HTTPException(status_code=500, detail=f"Unable to complete {context}.") from e
    except Exception as e:
        _safe_rollback(db)
        logger.exception("Unexpected error during %s", context)
        raise HTTPException(status_code=500, detail=f"Error during {context}.") from e