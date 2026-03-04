from pathlib import Path

# backend/app/core/config.py

BASE_DIR = Path(__file__).resolve().parent.parent

ASSETS_DIR = BASE_DIR / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"
THEMES_DIR = ASSETS_DIR / "themes"
POSTERS_DIR = ASSETS_DIR / "posters"

# Ensure posters directory exists
POSTERS_DIR.mkdir(parents=True, exist_ok=True)
