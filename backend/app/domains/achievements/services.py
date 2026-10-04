from typing import List, Optional
from collections import defaultdict 
from datetime import date, timedelta, datetime 

from app.domains.achievements.schemas import Achievement


TIER_NAMES = ["bronze", "silver", "gold"]

def tiered(id: str, title: str, description: str, value: int, thresholds: List[int]) -> Achievement:
    """Build a tiered acheivements from a value and ascending thresholds, e.g. [7, 14, 30]"""
    earned_count = sum(1 for t in thresholds if value >=t )
    tier = TIER_NAMES[earned_count-1] if earned_count else None
    next_target = thresholds[earned_count] if earned_count < len(thresholds) else thresholds[-1]

    return Achievement(
        id=id, 
        title=title, 
        description=description.format(target=next_target),
        tier=tier, 
        progress=value, 
        target=next_target, 
        earned=earned_count > 0
    )


def current_streaks(practice_dates: List[date], today:Optional[date] = None) -> int:
    """Consecutive days practiced, ending today (or yesterday, so the streak doesn't reset before the student has had
    a chance to practice today)"""

    today = today or date.today()
    days = set(practice_dates)

    day = today if today in days else today - timedelta(days=1)
    streak = 0
    while day in days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def count_comebacks(silver_rows) -> int:
    """Subtopics that were 'needs_review' at some point and later reached 'mastered'.
    in a snapshot with enough questions to be meaningful. """

    MIN_QUESTIONS_FOR_MASTERY = 5

    history = defaultdict(list)
    for row in sorted(silver_rows, key=lambda r: r.completed_at):
        key = (row.topic, row.subtopic)
        num_questions = (row.questions_answered or {}).get("num_questions", 0)
        history[key].append((row.status,  num_questions))

    comebacks = 0
    for snapshots in history.values():
        struggle_index = next( (i for i, (status, _) in enumerate(snapshots) if status == "needs_review"), None )
        if struggle_index is None:
            continue
        recovered = any(status == "mastered" and n>= MIN_QUESTIONS_FOR_MASTERY for status, n in snapshots[struggle_index+ 1:])
        if recovered:
            comebacks += 1
    return comebacks


def compute_achievements(practice_dates, question_attempts, quizzes, silver_rows) -> List[Achievement]:
    return [
        tiered(
            "streak", "On a Roll",
            "Practice {target} days in a row",
            current_streaks(practice_dates), [7, 14, 30],
        ),
        tiered(
            "questions", "Question Crusher",
            "Answer {target} questions",
            len(question_attempts), [100, 500, 1000],
        ),
        tiered(
            "quizzes", "Quiz Crusher", 
            "Complete {target} quizzes", 
            len(quizzes), [1, 5, 10],
        ), 
        tiered(
            "comeback", "Comeback",
            "Master {target} subtopic",
            count_comebacks(silver_rows), [1, 3, 5],
        ),
    ]