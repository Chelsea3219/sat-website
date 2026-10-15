# backend/scripts/purge_stale_jobs.py
from rq import Queue
from rq.registry import FailedJobRegistry, ScheduledJobRegistry, DeferredJobRegistry
from app.worker.explanation.queues import redis_conn

OLD_PREFIX = "app.worker.explanation_job."

for name in ["answer_explantions_bulk", "answer_explanations"]:
    q = Queue(name, connection=redis_conn)
    registries = [q, FailedJobRegistry(queue=q), ScheduledJobRegistry(queue=q), DeferredJobRegistry(queue=q)]
    for reg in registries:
        for jid in reg.get_job_ids():
            job = q.fetch_job(jid)
            if job and job.func_name.startswith(OLD_PREFIX):
                print("deleting", jid)
                job.delete()