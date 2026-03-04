from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Use SSL if rediss:// scheme
is_ssl = REDIS_URL.startswith("rediss://")
redis_options = {"ssl_cert_reqs": None} if is_ssl else {}

celery_app = Celery(
    "city_map_poster",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks.poster_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    result_expires=3600,
    broker_use_ssl=redis_options if is_ssl else None,
    redis_backend_use_ssl=redis_options if is_ssl else None,
)