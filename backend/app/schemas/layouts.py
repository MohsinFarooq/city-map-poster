# poster/layouts.py

LAYOUT_CONFIG = {
    "pc": {
        "type": "wallpaper",
        "width": 3840,
        "height": 2160,
        "dpi": 300,
        "margin": 0.06,  # 6% safe margin
    },
    "mobile": {
        "type": "wallpaper",
        "width": 1440,
        "height": 2560,
        "dpi": 300,
        "margin": 0.08,
    },
    "a4": {
        "type": "print",
        "width": 2480,   # A4 @ 300 DPI
        "height": 3508,
        "dpi": 300,
        "margin": 0.1,
    },
}
