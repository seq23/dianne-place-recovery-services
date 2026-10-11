#!/usr/bin/env python3
"""Builds the site's icon set and social card from the globals.css palette.

No logo exists in the repo, so the mark is the initial "D" on --blue-deep with
--cream ink and a --gold rule. Re-run after a palette change; outputs are
committed under public/ and checked by scripts/validators/validate_site_hygiene.mjs.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / "public"
BLUE_DEEP, BLUE_INK, CREAM, GOLD = "#174c5f", "#102f3b", "#fff8ef", "#b98b45"
SERIF = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
identity = json.loads((ROOT / "data/seo/site_identity.json").read_text())


def mark(size):
    img = Image.new("RGB", (size, size), BLUE_DEEP)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(SERIF, int(size * 0.66))
    d.text((size / 2, size * 0.47), "D", font=f, fill=CREAM, anchor="mm")
    w = max(1, size // 24)
    d.rectangle([size * 0.28, size * 0.80, size * 0.72, size * 0.80 + w], fill=GOLD)
    return img


mark(512).save(PUB / "icon-512.png")
mark(192).save(PUB / "icon-192.png")
mark(180).save(PUB / "apple-touch-icon.png")
mark(64).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

og = Image.new("RGB", (1200, 630), BLUE_DEEP)
d = ImageDraw.Draw(og)
d.rectangle([0, 0, 1200, 630], fill=BLUE_DEEP)
d.rectangle([0, 560, 1200, 630], fill=BLUE_INK)
og.paste(mark(160), (80, 80))
d.text((80, 300), "Dianne's Place", font=ImageFont.truetype(SERIF, 84), fill=CREAM)
d.text((80, 400), "Recovery Services", font=ImageFont.truetype(SERIF, 56), fill=CREAM)
d.rectangle([80, 485, 280, 489], fill=GOLD)
d.text((80, 506), "Recovery housing · structured sober living · referral support",
       font=ImageFont.truetype(SANS, 30), fill=CREAM)
host = identity["origin"].replace("https://", "")
d.text((80, 577), f"{host}  ·  {identity['phone']}", font=ImageFont.truetype(SANS, 30), fill=GOLD)
og.save(PUB / "og-image.png", optimize=True)

manifest = {
    "name": "Dianne's Place Recovery Services",
    "short_name": "Dianne's Place",
    "start_url": "/",
    "display": "standalone",
    "background_color": CREAM,
    "theme_color": BLUE_DEEP,
    "icons": [
        {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
    ],
}
(PUB / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")
print("brand assets written")
