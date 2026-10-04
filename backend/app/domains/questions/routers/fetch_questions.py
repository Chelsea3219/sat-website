# Import Python libraries and files 
import pprint
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.domains.questions.schemas import IncomingQuestions, PracticeSession
from app.domains.analytics.schemas import IncomingPracticeSheet
from app.domains.questions.services.difficulty_to_mastery_score import determine_proficiency
from app.domains.questions.services.fetch_questions import fetch_subtopic_questions, fetch_section_questions
from app.domains.questions.services.question_selection import practice_question_selection, quiz_question_selection, quiz_assessment_selection
from app.domains.analytics.services.grading_algorithms import get_effective_mastery_score
from app.domains.students.services.fetch_student_info import fetch_student_info, fetch_subtopic_mastery, fetch_question_attempts

router = APIRouter(prefix="/api/questions", tags=["questions"])


# FETCHES QUESTIONS BASED ON SUBTOPIC FROM DATABASE
@router.post("/practice/fetch-questions/{clerk_id}/{subtopic}")
def fetch_practice_questions(
    clerk_id: str, 
    subtopic: str, 
    session_answers: List[IncomingPracticeSheet] = [], # sent from frontend, tracks the session progress so far
    db=Depends(get_db)
) -> PracticeSession:

    # Format the subtopic
    subtopic = subtopic.lower()
    subtopic_normalized = subtopic.replace("-", " ")
    
    # Fetches student's subtopic mastery scores 
    subtopics_mastery = fetch_subtopic_mastery(clerk_id, db)

    # Fetches questions based on subtopic not already answered
    already_seen_ids = [a.question_id for a in session_answers]
    questions = fetch_subtopic_questions(subtopic_normalized, db, already_seen_ids)

    # Subtopic Mastery Score
    current_mastery_score = next((sub.mastery_score["mastery_score"] for sub in subtopics_mastery if sub.subtopic == subtopic_normalized), 0)

    # Calculate the effective mastery score 
    effective_mastery_score = get_effective_mastery_score(current_mastery_score, session_answers)

    # Select questions on student's ability
    selected_questions = practice_question_selection(questions, effective_mastery_score)

    results = {
        "selected_questions": selected_questions, 
        "in_session_score": effective_mastery_score
    }

    return results 


@router.get("/quiz/fetch-questions/{clerk_id}/{section}")
def fetch_quiz_questions(
    clerk_id: str, 
    section: str, 
    db=Depends(get_db)
) : # -> List[IncomingQuestions]
    
    # Normalizes the section 
    section = section.lower()
    section_mastery = "math_mastery" if section == "math" else "reading_mastery"

    # Fetches student's information 
    student_info, question_attempts, test_score, past_analytics, quiz_analytics, subtopics_mastery = fetch_student_info(clerk_id, db)

    # Fetch questions based on section
    # already_seen_ids = [a.question_id for a in question_attempts] TODO decide if you need to do this
    questions = fetch_section_questions(section, db)
    
    # Quiz versus Assessment
    mastery_data = getattr(quiz_analytics, section_mastery)
    if mastery_data["max_score"] == 0:
        # Determine student's proficiency
        section_score = "math_score" if section == "math" else "reading_score"
        current_score = test_score[0].current_score[section_score]
        proficiency = determine_proficiency(current_score)
        selected_questions = quiz_assessment_selection(section, proficiency, questions)
    else:
        selected_questions = quiz_question_selection(questions, section, subtopics_mastery)

    return selected_questions

