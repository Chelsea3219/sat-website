# Import Python libraries and files
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.domains.analytics.models import GoldAnalytics, GoldSubtopicMastery, QuestionAttempts, SilverSubtopicMasteryModel, SilverAnalytics 
from app.domains.analytics.schemas import IncomingPracticeSheet, PracticeSessionSummary, IncomingAnswerSheet
from app.domains.errors.error_handler import handle_db_errors
from app.domains.analytics.services.grading_algorithms import grade_practice_answer_sheet, grade_quiz_answer_sheet
from app.domains.analytics.services.practice_analytics import build_subtopic_mastery, update_subtopic_mastery
from app.domains.analytics.services.quiz_analytics import update_gold_analytics
from app.domains.analytics.services.sqlalchemy_tools import to_plain

router = APIRouter(prefix="/api/analytics", tags=["analytics"])



@router.post("/practice/{subtopic}/grade-questions/{clerk_id}/{session_id}")
def grade_practice_questions(
    clerk_id: str, 
    session_id: str, 
    subtopic: str, 
    answer_sheet: List[IncomingPracticeSheet], 
    db=Depends(get_db)
) -> PracticeSessionSummary:
    
    # Guard against an empty answer sheet 
    if not answer_sheet:
        raise(HTTPException(status_code=400, detail="Answer sheet cannot be empty."))

    # Declare the parameters
    section = answer_sheet[0].section
    topic = answer_sheet[0].topic 

    # FIRST STEP: Grade the practice answer sheet
    subtopic_mastery = grade_practice_answer_sheet(answer_sheet)

    with handle_db_errors(db, "saving the practice results in the db"):
        # Declares the basic stats
        session_info = {
            "session_id": session_id, 
            "clerk_id": clerk_id
        }

        # SECOND STEP: Save the session attempts in the silver.question_attempts table 
        for attempt in answer_sheet:
            question_attempts = QuestionAttempts(
                **session_info,
                session_type = "practice",
                question_id = attempt.question_id,
                difficulty = attempt.difficulty, 
                is_correct = attempt.is_correct, 
                time_elapsed = attempt.time_elapsed, 
                completed_at = datetime.now()
            )
            db.add(question_attempts)

        # THIRD STEP: Saves the current subtopic mastery score in the silver.subtopic_mastery
        fields = build_subtopic_mastery( section, topic, subtopic, subtopic_mastery, answer_sheet)
        db.add( SilverSubtopicMasteryModel( **fields, **session_info, completed_at=datetime.now()))
        

        # FOURTH STEP: Retrieves the previous subtopic analytics, update, and save to the gold.subtopic_mastery table
        gold_subtopic_mastery = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id==clerk_id, GoldSubtopicMastery.subtopic == subtopic).first()
        if gold_subtopic_mastery is None:
            db.add( GoldSubtopicMastery(**fields, **session_info, last_wrong_at = datetime.now()) )
        else: 
            updated = update_subtopic_mastery(fields, gold_subtopic_mastery)
            gold_subtopic_mastery.session_id = session_id
            gold_subtopic_mastery.mastery_score = updated["mastery_score"]
            gold_subtopic_mastery.questions_answered = updated["questions_answered"]
            gold_subtopic_mastery.avg_time_elapsed = updated["avg_time_elapsed"]
            gold_subtopic_mastery.status = updated["status"]
            gold_subtopic_mastery.last_wrong_at = datetime.now()
        db.commit()

    # Format summary
    practice_session_summary = {
        "current_subtopic_mastery": fields, 
        "updated_subtopic_mastery": updated
    }
    return practice_session_summary



@router.post("/quiz/{section}/grade-questions/{clerk_id}/{session_id}")
def grade_quiz_questions(
    clerk_id: str,
    session_id: str,
    section: str,
    answer_sheet: List[IncomingAnswerSheet],
    db = Depends(get_db)
):
    # Guard against an empty answer sheet
    if not answer_sheet:
        raise(HTTPException(status_code=400, detail="Answer sheet cannot be empty."))

    # FIRST STEP : Grade the quiz answer sheet
    results = grade_quiz_answer_sheet(section, answer_sheet)

    with handle_db_errors(db, "saving the quiz results in the db"):
        # Declares the basic stats
        session_info = {
            "session_id": session_id, 
            "clerk_id": clerk_id
        }

        # SECOND STEP: Save the session attempts in the silver.question_attempts table 
        for attempt in answer_sheet:
            question_attempts = QuestionAttempts(
                **session_info,
                session_type = "quiz", 
                question_id = attempt.question_id,
                difficulty = attempt.difficulty, 
                is_correct = attempt.is_correct, 
                time_elapsed = attempt.time_elapsed, 
                completed_at = datetime.now()
            )
            db.add(question_attempts)

        # THIRD STEP: Saves the current quiz analytics to the silver.quiz_analytics table
        silver_quiz_analytics = SilverAnalytics(
            section = section,
            section_mastery=results.section_mastery.model_dump(), 
            topics_mastery = {k: v.model_dump() for k, v in results.topic_mastery.items()}, 
            **session_info, 
            completed_at = datetime.now()
        )
        db.add(silver_quiz_analytics)

        # FOURTH STEP: Retrieves the previous quiz analytics, update, and save to the gold.quiz_analytics table
        previous = db.query(GoldAnalytics).filter(GoldAnalytics.clerk_id == clerk_id).order_by(GoldAnalytics.completed_at.desc()).first()
        fields0 = update_gold_analytics(section, previous, results.section_mastery, results.topic_mastery)
        if previous is None:
            gold_quiz_analytics = GoldAnalytics(
                **session_info,
                reading_mastery=fields0["reading_mastery"],
                reading_topics_mastery=fields0["reading_topics_mastery"],
                math_mastery=fields0["math_mastery"],
                math_topics_mastery=fields0["math_topics_mastery"],
                completed_at=datetime.now(),
            )
            db.add(gold_quiz_analytics)
        else: 
            previous.session_id = session_id
            previous.reading_mastery = fields0["reading_mastery"]
            previous.reading_topics_mastery = fields0["reading_topics_mastery"]
            previous.math_mastery = fields0["math_mastery"]
            previous.math_topics_mastery = fields0["math_topics_mastery"]
            previous.completed_at = datetime.now()

        updated_subtopic_mastery = []
        for sub in results.subtopic_mastery:
            # FIFTH STEP: Saves the subtopic mastery in the silver.practice analysis
            fields = {
                "session_id": session_id, 
                "clerk_id": clerk_id, 
                "section": sub.section, 
                "topic": sub.topic, 
                "subtopic" : sub.subtopic, 
                "mastery_score": sub.mastery_score.model_dump(), 
                "questions_answered": sub.questions_answered.model_dump(),
                "avg_time_elapsed": sub.avg_time_elapsed, 
                "status": sub.status
            }
            silver_subtopic_mastery = SilverSubtopicMasteryModel(**fields, completed_at=datetime.now())
            db.add(silver_subtopic_mastery)

            # SIXTH STEP: Retrieves gold_subtopic_mastery, update and replace it in the gold_subtopic_mastery
            previous_gold_subtopic_mastery = db.query(GoldSubtopicMastery).filter(GoldSubtopicMastery.clerk_id == clerk_id, GoldSubtopicMastery.subtopic == sub.subtopic).first()
            if previous_gold_subtopic_mastery is None:
                db.add(GoldSubtopicMastery(**fields, last_wrong_at=datetime.now()))
            else:
                updated = update_subtopic_mastery(silver_subtopic_mastery, previous_gold_subtopic_mastery)
                updated_subtopic_mastery.append(updated)
                previous_gold_subtopic_mastery.session_id = session_id 
                previous_gold_subtopic_mastery.mastery_score = updated["mastery_score"]
                previous_gold_subtopic_mastery.questions_answered = updated["questions_answered"]
                previous_gold_subtopic_mastery.avg_time_elapsed = updated["avg_time_elapsed"]
                previous_gold_subtopic_mastery.status = updated["status"]
                previous_gold_subtopic_mastery.last_wrong_at = datetime.now()

        #db.commit()

        quiz_results = {
            "section_mastery": results.section_mastery, 
            "topic_mastery": results.topic_mastery,
            "subtopic_mastery": results.subtopic_mastery, 
            "updated_quiz_analytics": fields0, 
            "updated_practice_analytics": updated_subtopic_mastery
        }
    return quiz_results