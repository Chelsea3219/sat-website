from datetime import datetime, UTC
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from typing import Annotated
from clerk_backend_api.security.types import RequestState

from app.core.database import get_db
from app.core.auth import require_auth
from app.core.logging_config import setup_logging

from app.domains.database.upsert import upsert
from app.domains.errors.error_handler import handle_db_errors

from app.domains.students.models import SilverUsers, TestScores, BronzeUsers
from app.domains.analytics.models import GoldAnalytics
from app.domains.students.schemas import RegisterStudents
from app.domains.questions.services.topic import reading_topics, math_topics
from app.domains.payments.services import require_paid_plan

import logging
setup_logging() 
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["students"])

@router.post("/register")
async def register_students(
    payload: RegisterStudents, 
    state: Annotated[RequestState, Depends(require_auth)], # TODO make sure to add/switch to require_permission
    db: Session=Depends(get_db)
):

    # Determines key-value pairs
    clerk_id = state.payload["sub"]
    now = datetime.now(UTC)
    common_fields = {
        "school" : payload.school,
        "state" : payload.state,
        "grade_level" : payload.grade_level,

        "original_score" : payload.original_score.model_dump(),
        "dream_score" : payload.dream_score,
        "test_date" : payload.test_date,
        "learning_targets" : payload.learning_targets.model_dump(),
        "referral": payload.referral
    }

    # Update bronze and silver users
    with handle_db_errors(db, "syncing the bronze and silver user tables with profile details"):
        upsert(
            db=db, 
            model=BronzeUsers, 
            lookup_field="clerk_id", 
            lookup_value=clerk_id, 
            **(common_fields | {"referral": payload.referral})
        )
        upsert(
            db=db, 
            model=SilverUsers, 
            lookup_field="clerk_id", 
            lookup_value=clerk_id, 
            **(common_fields | {"updated_at":now})
        )
        db.commit()


    with handle_db_errors(db, "adding new records for the test scores and gold_analytics tables"):
        db.add( TestScores(
            clerk_id=clerk_id, 
            current_score = payload.original_score.model_dump(),
            dream_score = payload.dream_score,
            test_date = payload.test_date,
            type = "original score",
            created_at = now 
        ))

        db.add( GoldAnalytics(
            clerk_id = clerk_id,
            session_id = 0, 
            reading_mastery = {"raw_score": 0, "max_score": 0, "mastery_score": 0}, 
            reading_topics_mastery = {t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in reading_topics},
            math_mastery = {"raw_score": 0, "max_score": 0, "mastery_score": 0},
            math_topics_mastery =  {t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in math_topics},
            completed_at = datetime.now()
        ))
        db.commit()
    return {"status": "success", "detail": "Student's Information upload successfully."}
    
    
    