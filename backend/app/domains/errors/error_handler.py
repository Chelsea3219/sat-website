import logging
from contextlib import contextmanager
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError, OperationalError

logger = logging.getLogger(__name__)

@contextmanager
def handle_db_errors(db: Session, context: str = "database operation"):
    """
    Wraps a DB operation, rolling back and raising the right HTTPException
    on failure. Use as: `with handle_db_errors(db, "saving contact message"):`
    """
    try:
        yield
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error during {context}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail="Invalid data submitted.")
    except OperationalError as e: # connection to server ... SSL connection has been closed unexpectedly
        db.rollback()
        logger.error(f"Database operational error during {context}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=503, detail="Database operational error.")
    except SQLAlchemyError:
        db.rollback()
        logger.exception(f"Database error during {context}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unable to complete {context}.")
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during {context}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error during {context}")


    