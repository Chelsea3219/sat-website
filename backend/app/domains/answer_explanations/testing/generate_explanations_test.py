
from redis import Redis
from rq import Retry
from app.core.database import SessionLocal

from app.core.config import settings
from app.domains.questions.services.fetch_questions import fetch_unanswered_questions

from app.worker.explanation_job import explanation_job
from app.worker.queues import backfill_queue
from app.domains.questions.utils import content_hash

def main():
    db = SessionLocal()

    try:
        unanswered_questions = fetch_unanswered_questions(db)
        for q in unanswered_questions:
            question_id = str(q.question_id)
            qid, h = question_id , content_hash(q)
            job = backfill_queue.enqueue(
                explanation_job, qid, h, 
                job_id = f"explain{qid}-{h}", 
                retry=Retry(max=3, interval=[60, 120, 300])
            )
            #print("queued", job.id)
        #print(f"Enqueued {len(unanswered_questions)} jobs")
    finally:
        db.close()

if __name__ == "__main__":
    main()


# python -m app.domains.answer_explanations.testing.generate_explanations_test 