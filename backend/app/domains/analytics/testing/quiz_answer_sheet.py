import json
import random
from datetime import datetime, timedelta
import uuid


with open(
    "/Users/chelseazebaze/Desktop/sat-website/backend/app/domains/analytics/testing/random_questions.json",
    "r",
    encoding="utf-8",
) as file:
    questions = json.load(file)


DIFFICULTIES = ["easy", "medium", "hard"]
ANSWER_CHOICES = ["A", "B", "C", "D"]


def make_answer_sheet(question, clerk_id, session_id, base_time):

    return {
        "clerk_id": clerk_id,
        "session_id": session_id,

        # IMPORTANT:
        # Use the actual question ID from random_questions.json
        "question_id": question["question_id"],

        "section": "math",
        "topic": question["topic"],
        "subtopic": question["subtopic"],
        "difficulty": question["difficulty"],

        "answer": random.choice(ANSWER_CHOICES),

        "is_correct": random.random() < 0.65,

        "time_elapsed": random.randint(15, 120),

        "completed_at": (
            base_time
            + timedelta(seconds=random.randint(0, 3600))
        ).isoformat(),
    }


def generate_answer_sheets(n=10):

    clerk_id = "user_3I6KbSrNh746ta8wAzbtHYE1RFs"
    session_id = "sess_a1b2c4d4"

    base_time = datetime(2026, 9, 17, 9, 0, 0)

    # Pick n questions from your actual question JSON
    selected_questions = random.sample(questions, k=n)

    return [
        make_answer_sheet(
            question,
            clerk_id,
            session_id,
            base_time,
        )
        for question in selected_questions
    ]


answer_sheets = generate_answer_sheets(20)


if __name__ == "__main__":
    print(json.dumps(answer_sheets, indent=2))