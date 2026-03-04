from pathlib import Path
from datetime import datetime
import time
import json

import matplotlib
matplotlib.use("Agg")

import osmnx as ox
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import matplotlib.colors as mcolors
import numpy as np
from geopy.geocoders import Nominatim



from app.schemas.layouts import LAYOUT_CONFIG
from app.core.config import FONTS_DIR, THEMES_DIR, POSTERS_DIR
import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# ---------- Fonts & Themes ----------

def load_fonts():
    fonts = {
        "bold": FONTS_DIR / "Roboto-Bold.ttf",
        "regular": FONTS_DIR / "Roboto-Regular.ttf",
        "light": FONTS_DIR / "Roboto-Light.ttf",
    }

    for path in fonts.values():
        if not path.exists():
            return None

    return fonts


def get_available_themes():
    return [p.stem for p in THEMES_DIR.glob("*.json")]


def load_theme(theme_name: str) -> dict:
    theme_file = THEMES_DIR / f"{theme_name}.json"

    if not theme_file.exists():
        raise ValueError(f"Theme '{theme_name}' not found")

    with open(theme_file, "r") as f:
        return json.load(f)


# ---------- Utilities ----------

def generate_output_filename(city: str, theme: str) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    city_slug = city.lower().replace(" ", "_")
    filename = f"{city_slug}_{theme}_{timestamp}.png"
    return POSTERS_DIR / filename


def get_coordinates(city: str, country: str) -> tuple[float, float]:
    geolocator = Nominatim(user_agent="city_map_poster")
    time.sleep(1)  # respect rate limits

    location = geolocator.geocode(f"{city}, {country}")
    if not location:
        raise ValueError("Could not resolve city coordinates")

    return location.latitude, location.longitude


def format_coordinates(lat: float, lon: float) -> str:
    lat_dir = "N" if lat >= 0 else "S"
    lon_dir = "E" if lon >= 0 else "W"
    return f"{abs(lat):.4f}° {lat_dir} / {abs(lon):.4f}° {lon_dir}"


# ---------- Visual helpers ----------

def create_gradient_fade(ax, color, location="bottom", zorder=10):
    vals = np.linspace(0, 1, 256).reshape(-1, 1)
    gradient = np.hstack((vals, vals))

    rgb = mcolors.to_rgb(color)
    colors = np.zeros((256, 4))
    colors[:, :3] = rgb

    if location == "bottom":
        colors[:, 3] = np.linspace(1, 0, 256)
        start, end = 0.0, 0.25
    else:
        colors[:, 3] = np.linspace(0, 1, 256)
        start, end = 0.75, 1.0

    cmap = mcolors.ListedColormap(colors)

    xlim = ax.get_xlim()
    ylim = ax.get_ylim()
    y_range = ylim[1] - ylim[0]

    ax.imshow(
        gradient,
        extent=[
            xlim[0],
            xlim[1],
            ylim[0] + y_range * start,
            ylim[0] + y_range * end,
        ],
        aspect="auto",
        cmap=cmap,
        zorder=zorder,
        origin="lower",
    )


# ---------- Core rendering ----------

def create_poster(
    *,
    city: str,
    country: str,
    point: tuple[float, float],
    distance: int,
    theme: dict,
    fonts: dict | None,
    output_file: Path,
    label_mode: str,   # "city" | "coords" | "none"
    layout: str,       # "pc" | "mobile" | "a4"
):
    config = LAYOUT_CONFIG[layout]

    width = config["width"]
    height = config["height"]
    dpi = config["dpi"]

    fig_w = width / dpi
    fig_h = height / dpi

    fig, ax = plt.subplots(
        figsize=(fig_w, fig_h),
        dpi=dpi,
        facecolor=theme["bg"],
    )

    ax.set_facecolor(theme["bg"])
    ax.set_position([0, 0, 1, 1])

    # --- Map ---
    G = ox.graph_from_point(
        point,
       dist=min(distance, 15000),
        dist_type="bbox",
        network_type="drive",
    )

    ox.plot_graph(
        G,
        ax=ax,
        bgcolor=theme["bg"],
        node_size=0,
        edge_color=theme["road_default"],
        edge_linewidth=0.4,
        show=False,
        close=False,
    )
    del G  # free memory immediately after plotting
    import gc
    gc.collect()

    create_gradient_fade(ax, theme["gradient_color"], "bottom")
    create_gradient_fade(ax, theme["gradient_color"], "top")

    # --- Fonts (layout-aware) ---
    scale = {
        "pc": 1.0,
        "mobile": 1.1,
        "a4": 0.9,
    }[layout]

    coords_scale = {
    "pc": 1.0,
    "mobile": 0.55,
    "a4": 0.85,
}[layout]

    if fonts:
        font_city = FontProperties(fname=fonts["bold"], size=int(60 * scale))
        font_coords = FontProperties(fname=fonts["regular"], size=int(32 * coords_scale))
    else:
        font_city = FontProperties(weight="bold", size=int(60 * scale))
        font_coords = FontProperties(size=int(32 * coords_scale))

    # --- Labels ---
    lat, lon = point
    coords_text = format_coordinates(lat, lon)

    if label_mode == "city":
        ax.text(
            0.5,
            0.12,
            city.upper(),
            transform=ax.transAxes,
            ha="center",
            color=theme["text"],
            fontproperties=font_city,
        )

    elif label_mode == "coords":
        ax.text(
            0.5,
            0.08,
            coords_text,
            transform=ax.transAxes,
            ha="center",
            color=theme["text"],
            fontproperties=font_coords,
        )

    # label_mode == "none" → nothing rendered

    plt.savefig(output_file, dpi=dpi, facecolor=theme["bg"])
    plt.close(fig)


# ---------- Public API ----------

def generate_poster(
    *,
    city: str,
    country: str,
    theme: str,
    distance: int,
    label_mode: str = "city",
    layout: str = "pc",
) -> str:  
    theme_data = load_theme(theme)
    fonts = load_fonts()
    coords = get_coordinates(city, country)
    output_file = generate_output_filename(city, theme)

    create_poster(
        city=city,
        country=country,
        point=coords,
        distance=distance,
        theme=theme_data,
        fonts=fonts,
        output_file=output_file,
        label_mode=label_mode,
        layout=layout,
    )
    upload_result = cloudinary.uploader.upload(
        str(output_file),
        folder="city-map-posters",
        resource_type="image",
    )

    output_file.unlink(missing_ok=True)

    return upload_result["secure_url"]
