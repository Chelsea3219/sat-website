import logging

from rq import Queue, Retry, Worker
from rq.job import Job
from rq.exceptions import NoSuchJobError
from sqlalchemy import update

from app.core.database import SessionLocal
from app.core.logging_config import setup_logging
from app.domains.questions.services.fetch_questions import fetch_unanswered_questions
from app.domains.questions.utils import content_hash
from app.domains.questions.models import SilverQuestions
from app.worker.explanation.explanation_job import explanation_job
from app.worker.explanation.queues import backfill_queue, redis_conn, realtime_queue

setup_logging()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sweeper")

ACTIVE = {"queued", "started", "scheduled", "deferred"}
CURRENT_FUNC = f"{explanation_job.__module__}.{explanation_job.__name__}"


def job_is_active(job_id: str) -> bool:
    try:
        job = Job.fetch(job_id, connection=redis_conn)
    except NoSuchJobError:
        return False

    # Job enqueued with an old import path can never run: drop it so it gets re-queued
    if job.func_name != CURRENT_FUNC:
        logger.warning("Deleting stale job %s (func=%s)", job_id, job.func_name)
        job.delete()
        return False

    return job.get_status() in ACTIVE


def sweep() -> int:
    db = SessionLocal()
    queued = skipped = 0
    try:
        questions = fetch_unanswered_questions(db)
        for q in questions:
            qid, h = str(q.question_id), content_hash(q)
            job_id = f"explain-{qid}-{h}"

            if job_is_active(job_id):
                skipped += 1
                continue

            if q.explanation_status == "generating":
                db.execute(
                    update(SilverQuestions)
                    .where(SilverQuestions.question_id == q.question_id)
                    .values(explanation_status="pending")
                )
                db.commit()

            backfill_queue.enqueue(
                explanation_job, qid, h,
                job_id=job_id,
                retry=Retry(max=3, interval=[60, 120, 300]),
            )
            queued += 1

        logger.info("Sweeper: queued %d, already active %d, checked %d",
            queued, skipped, len(questions)
        )
        return queued
    finally:
        db.close()


def main() -> None:
    sweep()
    # Process everything queued (both queues), then exit so the cron run finishes
    Worker([realtime_queue, backfill_queue], connection=redis_conn).work(
        burst=True,
        with_scheduler=True,
    )


if __name__ == "__main__":
    main()

# python -m app.worker.explanation.sweeper