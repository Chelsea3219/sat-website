import json
import random
from datetime import datetime, timedelta
import uuid


def make_quiz_analytics(clerk_id, session_id):
    day = random.randint(0, 30)
    base_time = datetime(2026, 9, day, 9, 0, 0)

    return {
        "clerk_id": clerk_id,
        "session_id": session_id,

        "math_mastery":{
            "raw_score": random.randint(0, 100), 
            "max_score": 100,
            "mastery_score": random.randint(0, 100)
        },
        "math_topics_mastery": {
            "algebra": random.randint(0, 100), 
            "advanced math": random.randint(0, 100), 
            "problem solving & data analysis": random.randint(0, 100), 
            "geometry & trigonometry":random.randint(0, 100)
        },

        "reading_mastery":{
            "raw_score": random.randint(0, 100), 
            "max_score": 100,
            "mastery_score": random.randint(0, 100)
        },
        "reading_topics_mastery": {
            "information & ideas": random.randint(0, 100), 
            "craft & structure": random.randint(0, 100), 
            "expression of ideas": random.randint(0, 100), 
            "standard english conventions":random.randint(0, 100)
        },

        "completed_at": (
            base_time
            + timedelta(seconds=random.randint(0, 3600))
        ).isoformat()
    }


def generate_past_quiz_analytics(n=10):

    clerk_id = "user_3I6KbSrNh746ta8wAzbtHYE1RFs"
    session_id = "sess_a1b3c4d4"

    # Pick n questions from your actual question JSON

    return [
        make_quiz_analytics(
            clerk_id,
            session_id
        )
        for _ in range(n)
    ]


quiz_analytics = generate_past_quiz_analytics(20)


if __name__ == "__main__":
    print(json.dumps(quiz_analytics, indent=2))