#!/usr/bin/env python3
"""Build native-resolution pixel-art layers for Skyberry Hollow maps.

Every output pixel maps directly to one Phaser world pixel. Nothing is resized
at runtime, which keeps the environment on the same deterministic pixel grid as
the character and tile art.
"""

from pathlib import Path
from random import Random

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/maps-v2"
HEIGHT = 720
MAPS = {
    "sprout-camp": (1152, "camp", (126, 195, 219), (102, 164, 158), (78, 117, 102)),
    "brambleway": (1440, "bramble", (118, 181, 169), (73, 133, 105), (50, 91, 74)),
    "tidehollow": (1152, "tide", (122, 192, 219), (68, 139, 175), (54, 91, 123)),
    "gullhaven": (1440, "harbor", (137, 197, 221), (99, 151, 178), (77, 105, 137)),
    "stonewatch": (1344, "stone", (184, 178, 170), (124, 125, 125), (80, 83, 91)),
    "greenbloom": (1440, "range", (137, 198, 149), (77, 145, 98), (48, 98, 73)),
    "starwillow": (1344, "arcane", (151, 143, 205), (98, 91, 158), (65, 58, 111)),
    "sunmeadow": (1344, "range", (158, 211, 214), (124, 175, 116), (78, 126, 82)),
    "windroot": (1440, "bramble", (111, 171, 158), (65, 122, 93), (42, 78, 63)),
    "saltwind": (1344, "tide", (139, 203, 226), (82, 151, 183), (58, 102, 139)),
    "rubblepass": (1344, "stone", (176, 171, 165), (118, 116, 114), (74, 76, 84)),
    "whispering-range": (1344, "range", (128, 193, 143), (69, 133, 84), (43, 89, 64)),
    "moonlit-boughs": (1344, "arcane", (124, 119, 180), (79, 72, 134), (47, 42, 91)),
    "crystal-hollow": (1344, "arcane", (103, 172, 187), (70, 111, 142), (48, 68, 105)),
}


def rect(draw, xy, color):
    draw.rectangle(tuple(round(v) for v in xy), fill=color)


def cloud(draw, x, y, color):
    rect(draw, (x, y + 8, x + 58, y + 18), color)
    rect(draw, (x + 12, y + 2, x + 42, y + 20), color)
    rect(draw, (x + 24, y - 4, x + 48, y + 18), color)


def tree(draw, x, ground, trunk, leaf, size=1):
    rect(draw, (x - 6 * size, ground - 78 * size, x + 6 * size, ground), trunk)
    rect(draw, (x - 35 * size, ground - 118 * size, x + 31 * size, ground - 67 * size), leaf)
    rect(draw, (x - 23 * size, ground - 139 * size, x + 18 * size, ground - 92 * size), leaf)
    rect(draw, (x - 42 * size, ground - 103 * size, x - 18 * size, ground - 77 * size), leaf)


def house(draw, x, ground, wall, roof, accent):
    rect(draw, (x, ground - 102, x + 126, ground), wall)
    draw.polygon([(x - 14, ground - 100), (x + 62, ground - 158), (x + 140, ground - 100)], fill=roof)
    rect(draw, (x + 48, ground - 61, x + 76, ground), accent)
    rect(draw, (x + 13, ground - 78, x + 37, ground - 51), (174, 225, 224))
    rect(draw, (x + 91, ground - 78, x + 115, ground - 51), (174, 225, 224))


def build_back(name, width, kind, sky, far, deep):
    image = Image.new("RGBA", (width, HEIGHT), sky + (255,))
    draw = ImageDraw.Draw(image)
    for band in range(7):
        shade = tuple(max(0, c - band * 3) for c in sky)
        rect(draw, (0, band * 72, width, band * 72 + 71), shade + (255,))
    rng = Random(name)
    for x in range(48, width, 230):
        cloud(draw, x + rng.randrange(-24, 25), 85 + rng.randrange(-25, 35), (226, 240, 230, 210))
    hills = [(0, 500)]
    for x in range(0, width + 140, 140):
        hills.append((x, 410 + rng.randrange(-55, 46)))
    hills += [(width, HEIGHT), (0, HEIGHT)]
    draw.polygon(hills, fill=far + (255,))
    ridge = [(0, 590)]
    for x in range(0, width + 100, 100):
        ridge.append((x, 505 + rng.randrange(-42, 34)))
    ridge += [(width, HEIGHT), (0, HEIGHT)]
    draw.polygon(ridge, fill=deep + (255,))
    if kind in {"tide", "harbor"}:
        rect(draw, (0, 486, width, HEIGHT), (65, 135, 177, 255))
        for y in range(500, HEIGHT, 18):
            for x in range((y // 18 % 2) * 12, width, 48):
                rect(draw, (x, y, x + 21, y + 3), (127, 206, 220, 210))
    if kind == "arcane":
        rect(draw, (width - 188, 66, width - 142, 112), (234, 223, 255, 255))
        rect(draw, (width - 178, 58, width - 152, 120), (234, 223, 255, 255))
    image.save(OUT / f"{name}-back.png", optimize=True)


def build_mid(name, width, kind, _sky, far, deep):
    image = Image.new("RGBA", (width, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    ground = 660
    rng = Random(name + "-mid")
    if kind == "camp":
        tree(draw, 70, ground, (88, 61, 54, 255), (89, 145, 87, 255), 1)
        house(draw, 255, ground, (226, 183, 120, 255), (171, 87, 77, 255), (98, 67, 61, 255))
        house(draw, 755, ground, (219, 174, 112, 255), (139, 82, 104, 255), (88, 62, 66, 255))
        for x in range(430, 730, 42):
            rect(draw, (x, ground - 198 + ((x // 42) % 2) * 7, x + 20, ground - 184), (246, 193, 96, 255))
    elif kind == "bramble":
        for x in range(70, width, 180):
            tree(draw, x, ground, (67, 53, 47, 255), (54, 112, 72, 255), 1 + (x // 180) % 2)
        for x in (330, 970):
            draw.arc((x, 310, x + 260, 670), 185, 355, fill=(80, 58, 45, 255), width=24)
            draw.arc((x + 12, 323, x + 248, 660), 185, 355, fill=(102, 78, 52, 255), width=7)
    elif kind == "tide":
        rect(draw, (0, 620, width, 660), (101, 73, 56, 255))
        for x in range(0, width, 72):
            rect(draw, (x, 620, x + 5, 688), (67, 49, 45, 255))
        rect(draw, (630, 426, 638, 620), (81, 60, 55, 255))
        draw.polygon([(638, 438), (638, 538), (758, 508)], fill=(241, 222, 171, 255))
        draw.polygon([(504, 574), (792, 574), (742, 620), (548, 620)], fill=(81, 72, 68, 255))
    elif kind == "harbor":
        for x in range(60, width, 240):
            house(draw, x, ground, (190, 173, 145, 255), (77 + (x // 240) * 8, 105, 135, 255), (76, 68, 67, 255))
        rect(draw, (980, 345, 993, 660), (74, 66, 61, 255))
        rect(draw, (980, 345, 1240, 358), (74, 66, 61, 255))
        rect(draw, (1218, 351, 1227, 492), (115, 84, 62, 255))
    elif kind == "stone":
        for x in range(0, width, 168):
            rect(draw, (x, 490 + rng.randrange(-60, 20), x + 144, ground), (102, 99, 99, 255))
            rect(draw, (x + 12, 474 + rng.randrange(-34, 20), x + 122, 512), (136, 130, 121, 255))
        rect(draw, (820, 310, 1010, 660), (78, 80, 86, 255))
        for x in range(820, 1011, 38):
            rect(draw, (x, 288, x + 22, 330), (78, 80, 86, 255))
        rect(draw, (890, 530, 944, 660), (52, 55, 62, 255))
    elif kind == "range":
        for x in range(30, width, 170):
            tree(draw, x, ground, (76, 57, 47, 255), (64, 135, 74, 255), 1 + (x // 170) % 2)
        for x in (370, 1030):
            rect(draw, (x - 5, 498, x + 5, 660), (85, 61, 46, 255))
            for size, color in ((54, (237, 222, 174, 255)), (39, (195, 87, 75, 255)), (20, (237, 222, 174, 255)), (7, (75, 110, 151, 255))):
                draw.ellipse((x - size, 480 - size, x + size, 480 + size), fill=color)
    elif kind == "arcane":
        for x in range(20, width, 190):
            tree(draw, x, ground, (58, 48, 78, 255), (95, 77, 139, 255), 1 + (x // 190) % 2)
        for x in (300, 610, 1040):
            draw.polygon([(x, 660), (x + 28, 542), (x + 56, 660)], fill=(87, 213, 207, 255))
            draw.polygon([(x + 11, 641), (x + 28, 565), (x + 35, 642)], fill=(211, 255, 239, 255))
        rect(draw, (742, 404, 955, 660), (57, 50, 91, 255))
        for x in range(758, 940, 34):
            rect(draw, (x, 430, x + 20, 646), (104, 85, 147, 255))
    image.save(OUT / f"{name}-mid.png", optimize=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (width, kind, sky, far, deep) in MAPS.items():
        build_back(name, width, kind, sky, far, deep)
        build_mid(name, width, kind, sky, far, deep)
        print(f"Wrote {name} ({width}x{HEIGHT}) native layers")


if __name__ == "__main__":
    main()
