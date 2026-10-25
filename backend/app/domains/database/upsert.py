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
        **fields
):
    """
    Insert a new record or update an exisiting record. 
    Roll backs and converts database error through handle_db_errors().
    """

    with handle_db_errors(db, context=f"upsert {model.__name__}"):

        # Find the record by its unieque loookup field 
        column = getattr(model,lookup_field)
        record = db.query(model).filter(column == lookup_value).first()

        # if it does not exists, it creates a new one and add to db
        if record is None:
            record_fields = {
                **fields, 
                lookup_field: lookup_value
            }
            record = model(**record_fields)

            db.add(record)
        else:
            for key, value in fields.items():
                setattr(record, key, value)
        db.flush() # Sends SQL to the database; catches many DB errors 
        db.commit()
        db.refresh(record)

        return record 