import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.core.database import get_db

from app.models.silver import QuestionAttempts, SilverSubtopicMastery, SilverAnalytics
from app.models.gold import GoldAnalytics, GoldSubtopicMastery

from app.schemas.questions import IncomingQuestions
from app.schemas.answer_sheet import IncomingAnswerSheet

from app.domains.services import orm_to_dict
from app.domains.errors.error_handler import handle_db_errors
from app.domains.questions.fetch_questions import fetch_db_questions
from app.domains.questions.question_selector import fetch_assessment_questions, fetch_adaptive_questions
from app.domains.questions.grading_algorithms.grade_quiz import grade_quiz
from app.domains.questions.grading_algorithms.subtopics import build_subtopic_record
from app.domains.questions.grading_algorithms.user_analytics import  build_user_analytics, update_analytics
from app.domains.questions.helpers import determine_proficiency
from app.domains.students.fetch_student_info import fetch_student_info

router = APIRouter(prefix="/api/questions/quiz", tags=["questions"])


# FETCHES QUESTIONS FROM DATABASE ---------------------------------------------------------------------------------
@router.get("/fetch-questions/{clerk_id}/{section}")
def fetch_questions(clerk_id: str, section: str, db=Depends(get_db)) -> List[IncomingQuestions]:

    # Fetches student's information 
    student_info, test_score, student_analytics, weak_subtopics = fetch_student_info(clerk_id, db)

    # Fetches questions based on section
    questions = fetch_db_questions(section, db)

    # Determines proficiency
    section_score = "math_score" if section == "math" else "reading_score"
    current_score = test_score[-1].current_score[section_score]
    proficiency = determine_proficiency(current_score)

    # Math versus Reading
    section_mastery = "math_mastery" if section == "math" else "reading_mastery"

    # Assesmment or Adaptive Quiz
    mastery_data = getattr(student_analytics, section_mastery)  # gets the JSON column (a dict)
    if mastery_data["max_score"] == 0:
        questions = fetch_assessment_questions(section, proficiency, questions)
        print("assessment questions fetched")
    else:
        questions = fetch_adaptive_questions(section, questions)
        print("adaptive questions fetched")
    return questions


# GRADES THE ANSWERSHEET ------------------------------------------------------------------------------------------
@router.post("/grade-questions")
def grade_quiz_questions(answer_sheet:List[IncomingAnswerSheet], db=Depends(get_db)):

    # Guard against empty answer_sheet
    if not answer_sheet:
        raise HTTPException(status_code=400, detail="answer_sheet cannot be empty")

    # Converts Pydantic model into a dictionary so that it can be subscriptable 
    answer_sheet_dicts = [q.model_dump() for q in answer_sheet]

    # Calculates the section and topic mastery scores
    section_mastery, topics_mastery, subtopics_mastery = grade_quiz(answer_sheet_dicts, answer_sheet[0].section)

    # Save the results
    with handle_db_errors(db, "grading quiz and saving results"):
        # Recent user analytics
        user_analytics = build_user_analytics(answer_sheet[0].section, section_mastery, topics_mastery)

        # Formats the db record and saves analytics to silver analytics table 
        new_analytics = SilverAnalytics(
            clerk_id = answer_sheet[0].clerk_id, 
            type = "quiz", 
            focus = answer_sheet[0].section,
            **user_analytics, 
            completed_at = answer_sheet[-1].completed_at
        )
        db.add(new_analytics)
        db.flush()

        # Updates the user_analytics for the gold table 
        previous_analytics = (db.query(GoldAnalytics)
            .filter(GoldAnalytics.clerk_id == answer_sheet[0].clerk_id)
            .order_by(GoldAnalytics.completed_at.desc())
            .first()
        )
        new_dict, prev_dict = orm_to_dict(new_analytics), orm_to_dict(previous_analytics)
        gold_analytics = update_analytics(prev_dict, new_dict)
        db.add(GoldAnalytics(
            session_id = new_analytics.session_id,
            clerk_id = answer_sheet[0].clerk_id, 
            type = "quiz", 
            focus = answer_sheet[0].section,
            completed_at = answer_sheet[-1].completed_at,
            **gold_analytics))

        # Saves question attempts in the silver.question_attempts table 
        for attempt in answer_sheet:
            question_attempt = QuestionAttempts(
                session_id = new_analytics.session_id,
                clerk_id = new_analytics.clerk_id, 
                question_id = attempt.question_id,
                difficulty = attempt.difficulty, 
                is_correct = attempt.is_correct, 
                time_elapsed = attempt.time_elapsed, 
                completed_at = attempt.completed_at
            )
            db.add(question_attempt)

        # Formats the subtopic mastery scores and save them to the silver subtopic_mastery table 
        # Formats the db record
        subtopic_record = []
        for sub, stats in subtopics_mastery.items():
            # Formats the subtopic record
            silver_subtopic_record = build_subtopic_record(
                clerk_id = new_analytics.clerk_id, 
                section = answer_sheet[0].section, 
                sub = sub, 
                stats = stats
            )
            subtopic_record.append(silver_subtopic_record)
            db.add(SilverSubtopicMastery(**silver_subtopic_record, session_id = new_analytics.session_id, completed_at = new_analytics.completed_at))

        # Updates the GoldSubtopicMastery if it exists
        existing_gold_rows = (
            db.query(GoldSubtopicMastery)
            .filter(GoldSubtopicMastery.clerk_id == answer_sheet[0].clerk_id)
            .all()
        )
        if not existing_gold_rows:
            for record in subtopic_record:
                record["last_wrong_at"] = new_analytics.completed_at
                db.add(GoldSubtopicMastery(**record))
        else:
            print("Create an algorithm to updated the gold_subtopic_mastery if it exists")
            #TODO Create an algorithm to updated the gold_subtopic_mastery if it exists """
        db.commit()
        return "sucess"