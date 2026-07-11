#!/usr/bin/env python3
"""Build native 48px themed enemy sheets: four walk frames and two death frames."""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/enemies-v2"
TYPES = {
    "spriglet": ((92, 166, 88), (180, 224, 105), "leaf"),
    "bramblehog": ((105, 70, 58), (190, 123, 72), "spike"),
    "tidecrab": ((193, 79, 72), (244, 154, 92), "claw"),
    "stonepup": ((103, 106, 111), (177, 170, 151), "rock"),
    "bloomcap": ((116, 79, 145), (234, 121, 163), "cap"),
    "starcrawler": ((67, 129, 151), (105, 232, 218), "crystal"),
}


def frame(kind, base, accent, index):
    im = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if index >= 4:
        h = 9 if index == 4 else 4
        y = 38 if index == 4 else 42
        d.rectangle((9, y, 39, y + h), fill=base + ((210 if index == 4 else 120),))
        d.rectangle((15, y - 3, 33, y + 2), fill=accent + ((190 if index == 4 else 95),))
        return im
    bob = (0, -1, 0, 1)[index]
    foot = (1, 0, -1, 0)[index]
    outline = (53, 45, 54, 255)
    d.rectangle((10, 21 + bob, 38, 39 + bob), fill=outline)
    d.rectangle((13, 18 + bob, 35, 39 + bob), fill=base + (255,))
    d.rectangle((16, 16 + bob, 32, 21 + bob), fill=accent + (255,))
    d.rectangle((15 + foot, 38 + bob, 21 + foot, 43), fill=outline)
    d.rectangle((28 - foot, 38 + bob, 34 - foot, 43), fill=outline)
    d.rectangle((18, 25 + bob, 21, 28 + bob), fill=(245, 245, 215, 255))
    d.rectangle((29, 25 + bob, 32, 28 + bob), fill=(245, 245, 215, 255))
    d.point((20, 27 + bob), fill=(39, 37, 48, 255)); d.point((30, 27 + bob), fill=(39, 37, 48, 255))
    if kind == "leaf":
        d.polygon([(24, 17 + bob), (15, 7 + bob), (24, 10 + bob)], fill=accent + (255,))
        d.polygon([(25, 15 + bob), (36, 8 + bob), (30, 18 + bob)], fill=(73, 133, 71, 255))
    elif kind == "spike":
        for x in range(13, 38, 6): d.polygon([(x, 20 + bob), (x + 3, 9 + bob), (x + 6, 20 + bob)], fill=accent + (255,))
    elif kind == "claw":
        d.rectangle((4, 27 + bob, 13, 34 + bob), fill=accent + (255,)); d.rectangle((35, 27 + bob, 44, 34 + bob), fill=accent + (255,))
        d.rectangle((2, 24 + bob, 7, 29 + bob), fill=outline); d.rectangle((41, 24 + bob, 46, 29 + bob), fill=outline)
    elif kind == "rock":
        d.polygon([(12, 22 + bob), (17, 11 + bob), (27, 16 + bob), (34, 9 + bob), (38, 23 + bob)], fill=accent + (255,))
        d.line((15, 31 + bob, 23, 35 + bob, 29, 30 + bob, 35, 34 + bob), fill=(75, 76, 82, 255), width=2)
    elif kind == "cap":
        d.rectangle((8, 15 + bob, 40, 23 + bob), fill=(72, 48, 82, 255))
        d.rectangle((12, 10 + bob, 36, 20 + bob), fill=accent + (255,))
        d.rectangle((17, 13 + bob, 21, 16 + bob), fill=(255, 219, 177, 255)); d.rectangle((29, 16 + bob, 33, 19 + bob), fill=(255, 219, 177, 255))
    elif kind == "crystal":
        d.polygon([(13, 22 + bob), (18, 5 + bob), (25, 19 + bob), (31, 8 + bob), (37, 23 + bob)], fill=accent + (255,))
        d.polygon([(18, 7 + bob), (20, 18 + bob), (24, 19 + bob)], fill=(220, 255, 244, 255))
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (base, accent, kind) in TYPES.items():
        sheet = Image.new("RGBA", (48 * 6, 48), (0, 0, 0, 0))
        for i in range(6): sheet.alpha_composite(frame(kind, base, accent, i), (i * 48, 0))
        sheet.save(OUT / f"{name}.png", optimize=True)
        print(f"Wrote {name} walk/death sheet")


if __name__ == "__main__":
    main()
