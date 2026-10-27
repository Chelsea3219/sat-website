# Import Python libraries and packages 
from sqlalchemy.orm import Session
from typing import Type
from sqlalchemy import inspect 

from app.domains.errors.error_handler import handle_db_errors



def upsert(
        db: Session,
        model: Type,
        lookup_field: str,
        lookup_value: str,
        create_only: dict | None = None,
        **fields,
):
    """
    Find a row by lookup_field.
    - Missing: insert it with fields + create_only + the lookup value.
    - Present: update only `fields`; create_only values are never overwritten.
    Don't pass lookup_field inside fields or create_only.
    """
    column = getattr(model, lookup_field)
    record = db.query(model).filter(column == lookup_value).first()

    if record is None:
        record = model(**(create_only or {}), **fields, **{lookup_field: lookup_value})
        db.add(record)
    else:
        for key, value in fields.items():
            setattr(record, key, value)

    db.flush()
    return record