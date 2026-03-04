from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os

from app.api.posters import router as poster_router

load_dotenv()
limiter = Limiter(key_func=get_remote_address)
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")]

app = FastAPI(
    title="City Map Poster API",
    version="1.0.0",
    description="API for generating and downloading city map posters."
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
  allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poster_router, prefix="/api")