from app.core.celery_app import celery_app
from app.services.poster_service import generate_poster


@celery_app.task(bind=True, name="tasks.generate_poster")
def generate_poster_task(self, *, city: str, country: str, theme: str,
                          distance: int, label_mode: str, layout: str):
    try:
        self.update_state(state="PROGRESS", meta={"step": "Fetching map data…"})

        poster_url = generate_poster(
            city=city,
            country=country,
            theme=theme,
            distance=distance,
            label_mode=label_mode,
            layout=layout,
        )

        filename = poster_url.split("/")[-1]
        return {
            "status": "success",
            "filename": filename,
            "download_url": poster_url,
        }

    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        raise