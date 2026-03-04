from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import status
from celery.result import AsyncResult

from app.schemas.poster_schema import PosterGenerateRequest
from app.tasks.poster_tasks import generate_poster_task
from app.core.celery_app import celery_app
from app.core.config import POSTERS_DIR

router = APIRouter(prefix="/posters", tags=["Posters"])
limiter = Limiter(key_func=get_remote_address)

@router.post(
    "/generate",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Queue a city map poster generation job",
)
@limiter.limit("5/minute")
def generate_map_poster(request: Request, payload: PosterGenerateRequest):
    task = generate_poster_task.delay(
        city=payload.city,
        country=payload.country,
        theme=payload.theme,
        distance=payload.distance,
        label_mode=payload.label_mode,
        layout=payload.layout,
    )
    return {"job_id": task.id}


@router.get(
    "/status/{job_id}",
    summary="Poll the status of a generation job",
)
def get_job_status(job_id: str):
    result = AsyncResult(job_id, app=celery_app)

    if result.state == "PENDING":
        return {"job_id": job_id, "state": "pending"}

    if result.state == "STARTED":
        return {"job_id": job_id, "state": "progress", "step": "Starting…"}

    if result.state == "PROGRESS":
        return {
            "job_id": job_id,
            "state": "progress",
            "step": result.info.get("step", ""),
        }

    if result.state == "SUCCESS":
        return {
            "job_id": job_id,
            "state": "success",
            **result.result,
        }

    if result.state == "FAILURE":
        return {
            "job_id": job_id,
            "state": "failure",
            "error": str(result.info),
        }

    return {"job_id": job_id, "state": result.state.lower()}


@router.get(
    "/download/{filename}",
    response_class=FileResponse,
    summary="Download a generated poster",
)
def download_poster(filename: str):
    file_path: Path = POSTERS_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poster not found",
        )

    return FileResponse(
        path=file_path,
        media_type="image/png",
        filename=filename,
    )