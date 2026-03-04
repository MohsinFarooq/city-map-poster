import logging
logger = logging.getLogger(__name__)

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
        logger.error(f"Poster generation failed: {str(e)}", exc_info=True)
        raise