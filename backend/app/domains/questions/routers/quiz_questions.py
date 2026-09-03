
from fastapi import APIRouter, Depends
from typing import List 

from app.core.database import get_db

from app.models.bronze import BronzeQuestions
from app.models.silver import SilverQuestions, SilverUsers
from app.models.gold import UserAnalytics

from app.schemas.questions import IncomingQuestions

from app.domains.questions.fetch_questions import fetch_db_questions
from app.domains.questions.question_selector import fetch_assessment_questions, fetch_adaptive_questions
from app.domains.questions.helpers import determine_proficiency
from app.domains.students.fetch_student_info import fetch_student_info


router = APIRouter(prefix="/api/questions/quiz", tags=["questions"])

# TODO create two separate functions to fetch questions from quiz and practice

# FETCHES QUESTIONS FROM DATABASE 
@router.get("/fetch-questions/{clerk_id}/{section}")
def fetch_questions(clerk_id: str, section: str, db=Depends(get_db)) -> List[IncomingQuestions]:

    # Fetches student's information 
    student_info, test_score, student_analytics = fetch_student_info(clerk_id, db)

    # Fetches questions based on section
    questions = fetch_db_questions(section, db)

    # Determines proficiency
    section_score = "math_score" if section == "math" else "reading_score"
    current_score = test_score[-1].current_score[section_score]
    proficiency = determine_proficiency(current_score)

    # Math versus Reading
    section_mastery = "math_mastery" if section == "math" else "reading_mastery"
    weak_subtopics = student_analytics.weak_subtopics[section]

    # Assesmment or Adaptive Quiz
    mastery_data = getattr(student_analytics, section_mastery, weak_subtopics)  # gets the JSON column (a dict)
    if mastery_data["max_score"] == 0:
        questions = fetch_assessment_questions(section, proficiency, questions)
    else:
        questions = fetch_adaptive_questions(section, proficiency, questions)
    return questions

