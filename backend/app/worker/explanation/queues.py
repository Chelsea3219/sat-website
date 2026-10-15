from redis import Redis
from rq import Queue
from rq.job import Job

from app.core.config import settings

redis_conn = Redis.from_url(settings.REDIS_URL)
backfill_queue = Queue("answer_explantions_bulk", connection=redis_conn)
realtime_queue = Queue("answer_explanations", connection=redis_conn)