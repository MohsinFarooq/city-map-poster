from pydantic import BaseModel
from typing import Literal


class PosterGenerateRequest(BaseModel):
    city: str
    country: str
    theme: str = "midnight_blue"
    distance: int = 20000
    label_mode: Literal["city", "coords", "none"] = "city"
    layout: Literal["pc", "mobile", "a4"] = "pc"

class PosterGenerateResponse(BaseModel):
    status: str
    filename: str
    download_url: str