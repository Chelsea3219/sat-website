from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import func
from helpers import logger

from app.core.database import get_db
from app.models.bronze import BronzeUsers
from app.models.silver import SilverUsers, TestScores
from app.models.gold import UserAnalytics
from app.schemas.students import RegisterStudents
from app.domains.questions.helpers import reading_topics, math_topics

router = APIRouter(prefix="/api", tags=["students"])

@router.post("/register")
async def register_students(payload: RegisterStudents, db: Session=Depends(get_db)):

    # Checks for an existing student
    db_student = db.query(BronzeUsers).filter(BronzeUsers.clerk_id == payload.clerk_id).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Student already exists.")
    # If not, adds the student to the BronzeUsers, SilverUsers, and TestScores
    else:
        try:
            common_fields = {
                "clerk_id" : payload.clerk_id,
                "first_name" : payload.first_name,
                "last_name" : payload.last_name,
                "email" : payload.email,

                "school" : payload.school,
                "state" : payload.state,
                "grade_level" : payload.grade_level,

                "original_score" : payload.original_score.model_dump(),
                "dream_score" : payload.dream_score,
                "test_date" : payload.test_date,
                "learning_targets" : payload.learning_targets.model_dump(),
                "subscription": payload.subscription,

            }
            # Adds student to BronzeUsers
            bronze_student = BronzeUsers(
                **common_fields,
                role="student",
                referral=payload.referral,
                created_at=func.now()
            )
            db.add(bronze_student)

            # Adds student to SilverUser
            silver_student = SilverUsers(
                **common_fields,
                updated_at= func.now()
            )
            db.add(silver_student)

            # Initializes the student's analytics in UserAnalytics
            initial_mastery_score = {
                "raw_score": 0, 
                "max_score": 0,
                "mastery_score": 0
            }
            user_analytics = UserAnalytics(
                clerk_id = payload.clerk_id,
                type = "initial", 
                topic = "overall",
                reading_mastery = initial_mastery_score,
                reading_topics_mastery = {i: initial_mastery_score for i in reading_topics},
                math_mastery = initial_mastery_score,
                math_topics_mastery = {i: initial_mastery_score for i in math_topics},
                weak_subtopics = {
                    "reading": {},
                    "math": {}
                },
                completed_at = func.now()
            )
            db.add(user_analytics)

            # Adds student's test_score to TestScores
            test_score = TestScores(
                clerk_id = payload.clerk_id,
                current_score = payload.original_score.model_dump(),
                dream_score = payload.dream_score,
                test_date = payload.test_date,
                type = "original score",
                created_at = func.now()
            )
            db.add(test_score)
            db.commit()
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid student data form.")
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Database error while saving student information.")
            raise HTTPException(status_code=500, detail="Unable to save your student information.")
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving the student's information in the database: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
    return {"status": "success", "detail": "Student's Information upload successfully."}
    
    
    