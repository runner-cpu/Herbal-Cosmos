#!/usr/bin/env python3
"""Render the 1200x630 social share card from the current dataset.

Run from the repository root:

    python scripts/make-og-cover.py

The card intentionally repeats only counts that are computed from the JSON
files, so a refreshed dataset cannot drift away from the shared preview.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data" / "curated"
OUT = ROOT / "src" / "assets" / "share" / "og-cover.jpg"

W, H = 1200, 630
NAVY = (11, 20, 31)
CINNABAR = (181, 74, 58)
EMBER = (236, 140, 108)
PAPER = (240, 238, 231)
MIST = (183, 200, 197)
MUTED = (114, 139, 136)
HABITAT_COLORS = [
    (169, 120, 82),
    (121, 149, 108),
    (181, 139, 147),
    (197, 142, 80),
    (99, 142, 146),
    (117, 103, 125),
]

FONT_CJK_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_CJK = "C:/Windows/Fonts/msyh.ttc"
FONT_LATIN = "C:/Windows/Fonts/georgia.ttf"


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


class Sketch:
    """Tiny deterministic generator, so every run redraws the same card.

    Decorative only: the particle scatter never feeds anything but pixels, so a
    seedable LCG is preferable to a system RNG that would change the artwork.
    """

    def __init__(self, seed: int) -> None:
        self.state = seed & 0xFFFFFFFF

    def _next(self) -> int:
        self.state = (self.state * 1664525 + 1013904223) & 0xFFFFFFFF
        return self.state

    def random(self) -> float:
        return self._next() / 0x100000000

    def randrange(self, stop: int) -> int:
        return self._next() % stop

    def randint(self, low: int, high: int) -> int:
        return low + self._next() % (high - low + 1)

    def choice(self, items):
        return items[self._next() % len(items)]

    def uniform(self, low: float, high: float) -> float:
        return low + (high - low) * self.random()


def count_herbs() -> int:
    return len(json.loads((DATA / "herbs.json").read_text("utf-8"))["herbs"])


def count_sources() -> int:
    return len(json.loads((DATA / "sources.json").read_text("utf-8"))["sources"])


def tracked(draw: ImageDraw.ImageDraw, xy, text: str, font, fill, spacing: int) -> None:
    """Draw text with manual letter spacing; PIL has no tracking support."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + spacing


def nebula(size, center, radius, color, blur):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    paint = ImageDraw.Draw(layer)
    cx, cy = center
    steps = 26
    for step in range(steps, 0, -1):
        ratio = step / steps
        alpha = int(color[3] * (1 - ratio) ** 2)
        r = radius * ratio
        paint.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color[:3] + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def build_planet(size, center, radius, rng):
    """A deterministic particle disc standing in for the night-side planet."""
    cx, cy = center
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    paint = ImageDraw.Draw(layer)
    for step in range(18, 0, -1):
        ratio = step / 18
        r = radius * (1.12 + ratio * 0.55)
        alpha = int(46 * (1 - ratio) ** 2)
        paint.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(36, 92, 99, alpha))
    paint.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(13, 28, 38, 235))
    paint.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=(90, 155, 156, 90), width=2)

    for _ in range(300):
        angle = rng.random() * math.tau
        distance = radius * math.sqrt(rng.random()) * 0.96
        x = cx + math.cos(angle) * distance
        y = cy + math.sin(angle) * distance * 0.98
        color = HABITAT_COLORS[rng.randrange(len(HABITAT_COLORS))]
        dot = rng.choice([1, 1, 1, 2, 2, 3])
        alpha = rng.randint(120, 235)
        paint.ellipse((x - dot, y - dot, x + dot, y + dot), fill=color + (alpha,))

    for _ in range(26):
        angle = rng.random() * math.tau
        distance = radius * rng.uniform(1.05, 1.24)
        x = cx + math.cos(angle) * distance
        y = cy + math.sin(angle) * distance * 0.34
        paint.ellipse((x - 1, y - 1, x + 1, y + 1), fill=(222, 138, 106, 150))

    return layer.filter(ImageFilter.GaussianBlur(0.4))


def main() -> None:
    sketch = Sketch(20261018)
    herbs, sources = count_herbs(), count_sources()

    card = Image.new("RGB", (W, H), NAVY)
    card = Image.alpha_composite(card.convert("RGBA"), nebula((W, H), (905, 288), 430, (29, 86, 96, 120), 110))
    card = Image.alpha_composite(card.convert("RGBA"), nebula((W, H), (150, 560), 320, (124, 47, 37, 105), 100))

    stars = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    star_paint = ImageDraw.Draw(stars)
    for _ in range(150):
        x, y = sketch.randrange(W), sketch.randrange(H)
        if 92 <= x <= 700 and 120 <= y <= 430:
            continue
        size = sketch.choice([1, 1, 1, 2])
        color = sketch.choice([(222, 138, 106), (101, 187, 180), (183, 200, 197)])
        star_paint.ellipse((x, y, x + size, y + size), fill=color + (sketch.randint(70, 170),))
    card = Image.alpha_composite(card, stars)
    card = Image.alpha_composite(card, build_planet((W, H), (905, 300), 158, sketch))

    draw = ImageDraw.Draw(card)
    bold_132 = load_font(FONT_CJK_BOLD, 128)
    bold_96 = load_font(FONT_CJK_BOLD, 96)
    regular_28 = load_font(FONT_CJK, 28)
    regular_22 = load_font(FONT_CJK, 22)
    regular_18 = load_font(FONT_CJK, 18)
    tracked_18 = load_font(FONT_CJK, 18)
    latin_20 = load_font(FONT_LATIN, 20)

    seal = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    seal_paint = ImageDraw.Draw(seal)
    seal_paint.rectangle((0, 0, 63, 63), fill=CINNABAR + (255,))
    seal_paint.text((32, 34), "本", font=load_font(FONT_CJK_BOLD, 40), fill=PAPER, anchor="mm")
    seal = seal.rotate(-4, expand=True, resample=Image.BICUBIC)
    card.paste(seal, (88, 62), seal)
    draw = ImageDraw.Draw(card)

    tracked(draw, (164, 80), "A LIVING HERBAL ATLAS", tracked_18, (219, 138, 109), 2)
    draw.text((164, 104), "HERBAL COSMOS · FIELD ATLAS", font=load_font(FONT_LATIN, 15), fill=MUTED)

    draw.text((88, 158), "本草宇宙", font=bold_132, fill=PAPER)
    draw.text((88, 300), "百子万象", font=bold_132, fill=EMBER)
    draw.line((92, 456, 640, 456), fill=(207, 196, 183, 90), width=2)

    draw.text((92, 480), f"{herbs} 味本草 · 六类生境 · 昼夜双世界", font=regular_28, fill=MIST)
    draw.text((92, 522), "百子柜读生境，粒子星球读关系，一味档案逐条核对来源。", font=regular_18, fill=(139, 160, 157))

    draw.text((92, 580), f"{sources} 个公开来源 · 不构成医疗建议", font=regular_18, fill=MUTED)
    url = "runner-cpu.github.io/Herbal-Cosmos"
    draw.text((W - 88 - draw.textlength(url, font=latin_20), 580), url, font=latin_20, fill=(130, 153, 151))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.convert("RGB").save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
