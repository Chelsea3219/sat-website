# app/domains/answer_explanations/testing/enqueue_test.py
from redis import Redis
from rq import Queue

from app.core.database import SessionLocal
from app.domains.questions.services.fetch_questions import fetch_unanswered_questions
from app.domains.questions.utils import content_hash
from app.worker.explanation.explanation_job import explanation_job

queue = Queue("answer_explanations", connection=Redis.from_url("redis://localhost:6379/0"))

db = SessionLocal()
try:
    q = fetch_unanswered_questions(db, "linear functions")[0]
    job = queue.enqueue(explanation_job, str(q.question_id), content_hash(q))
    #print("Enqueued", job.id, "for", q.question_id)
finally:
    db.close()