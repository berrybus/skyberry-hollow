#!/usr/bin/env python3
"""Deterministically slice image-generated environment source atlases.

The generated atlases remain immutable source art. This exporter only crops,
registers, removes the platform chroma key, and writes runtime PNGs.
"""

import json
from collections import deque
from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/imagegen-environments-v1/source"
OUT = ROOT / "public/assets/environments-v1"

BACKGROUND_ATLASES = [
    ("dawnleaf-atlas-v1.png", [
        ("sprout-camp", 1152), ("sunmeadow", 1344), ("brambleway", 1440),
        ("windroot", 1440), ("tidehollow", 1152),
    ]),
    ("crownwind-towns-atlas-v1.png", [
        ("gullhaven", 1440), ("stonewatch", 1344),
        ("greenbloom", 1440), ("starwillow", 1344),
    ]),
    ("crownwind-wilds-atlas-v1.png", [
        ("saltwind", 1344), ("rubblepass", 1344),
        ("whispering-range", 1344), ("moonlit-boughs", 1344),
        ("crystal-hollow", 1344),
    ]),
]

PLATFORM_ORDER = [
    "sprout-camp", "sunmeadow", "brambleway", "windroot", "tidehollow",
    "gullhaven", "stonewatch", "greenbloom", "starwillow", "saltwind",
    "rubblepass", "whispering-range", "moonlit-boughs", "crystal-hollow",
]


def equal_rows(image: Image.Image, count: int):
    for index in range(count):
        top = round(image.height * index / count)
        bottom = round(image.height * (index + 1) / count)
        yield image.crop((0, top, image.width, bottom))


def export_backgrounds() -> None:
    for filename, maps in BACKGROUND_ATLASES:
        source = Image.open(SOURCE / filename).convert("RGB")
        for panel, (name, width) in zip(equal_rows(source, len(maps)), maps):
            # Crop to the runtime canvas ratio before scaling. Stretching the
            # wide source panels would distort buildings, trees, and landmarks.
            target_ratio = width / 720
            crop_width = min(panel.width, round(panel.height * target_ratio))
            left = (panel.width - crop_width) // 2
            registered = panel.crop((left, 0, left + crop_width, panel.height))
            # NEAREST keeps the generated pixel clusters crisp at runtime.
            back = registered.resize((width, 720), Image.Resampling.NEAREST).convert("RGBA")
            back.save(OUT / f"{name}-back.png", optimize=True)
            Image.new("RGBA", (width, 720), (0, 0, 0, 0)).save(
                OUT / f"{name}-mid.png", optimize=True
            )


def chroma_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, _ = pixels[x, y]
            # The source key varies slightly around #ff00ff; remove only the
            # strongly magenta field and preserve purple platform materials.
            alpha = 0 if r > 175 and b > 155 and g < min(r, b) * .66 else 255
            pixels[x, y] = (r, g, b, alpha)
    return rgba


def content_bands(image: Image.Image, expected: int) -> list[tuple[int, int]]:
    alpha = image.getchannel("A")
    active = [y for y in range(image.height) if sum(alpha.getpixel((x, y)) > 0 for x in range(image.width)) > 12]
    bands = []
    if active:
        start = previous = active[0]
        for y in active[1:]:
            if y > previous + 1:
                bands.append((start, previous + 1))
                start = y
            previous = y
        bands.append((start, previous + 1))
    if len(bands) != expected:
        raise RuntimeError(f"Expected {expected} opaque atlas rows, found {len(bands)}: {bands}")
    return bands


def opaque_ground_material(image: Image.Image) -> Image.Image:
    """Remove chroma fringe and extend neighboring material into keyed pixels."""
    image = image.convert("RGBA")
    pixels = image.load()
    queue = deque()
    distance = [[-1] * image.width for _ in range(image.height)]
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            magenta = r > 135 and b > 120 and g < min(r, b) * .78
            if a and not magenta:
                queue.append((x, y))
                distance[y][x] = 0
                pixels[x, y] = (r, g, b, 255)
            else:
                pixels[x, y] = (0, 0, 0, 0)
    while queue:
        x, y = queue.popleft()
        color = pixels[x, y]
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < image.width and 0 <= ny < image.height and distance[ny][nx] < 0:
                distance[ny][nx] = distance[y][x] + 1
                pixels[nx, ny] = color
                queue.append((nx, ny))
    return image


def despill_keyed_edges(image: Image.Image, passes: int = 4) -> Image.Image:
    image = image.convert("RGBA")
    for _ in range(passes):
        pixels = image.load()
        remove = []
        for y in range(image.height):
            for x in range(image.width):
                r, g, b, a = pixels[x, y]
                if not a:
                    continue
                key_like = r > 90 and b > 90 and abs(r - b) < 75 and r + b > 220 and g < min(r, b) * .58
                if not key_like:
                    continue
                edge = x in (0, image.width - 1) or y in (0, image.height - 1)
                touches_alpha = any(
                    0 <= nx < image.width and 0 <= ny < image.height and pixels[nx, ny][3] == 0
                    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                )
                if edge or touches_alpha:
                    remove.append((x, y))
        if not remove:
            break
        for x, y in remove:
            pixels[x, y] = (0, 0, 0, 0)
    return image


def export_platforms() -> None:
    source = chroma_alpha(Image.open(SOURCE / "platform-kits-atlas-v1.png").convert("RGB"))
    surfaces = {}
    bands = content_bands(source, len(PLATFORM_ORDER))
    for (top, bottom), name in zip(bands, PLATFORM_ORDER):
        row = source.crop((0, top, source.width, bottom))
        # Use the long authored variant; Phaser scales it modestly to each
        # platform's collision width while retaining unique ends/materials.
        long_piece = row.crop((round(row.width * .53), 0, row.width, row.height))
        keyed = long_piece
        bbox = keyed.getbbox()
        if bbox is None:
            raise RuntimeError(f"No platform pixels found for {name}")
        # Exact trim: runtime Y is the walkable top, so no transparent pixels
        # may survive above it or collision will appear detached from the art.
        trimmed = keyed.crop(bbox)
        alpha = trimmed.getchannel("A")
        # Decorations may rise above the deck. The walkable surface is the
        # first row with broad horizontal coverage, not the first opaque pixel.
        coverage = [sum(alpha.getpixel((x, y)) > 0 for x in range(trimmed.width)) / trimmed.width for y in range(trimmed.height)]
        surface_y = next((y for y, ratio in enumerate(coverage) if ratio >= .55), 0)
        surfaces[name] = {
            "surfaceRatio": surface_y / trimmed.height,
            "sourceWidth": trimmed.width,
            "sourceHeight": trimmed.height,
        }
        trimmed.save(OUT / f"platform-{name}.png", optimize=True)
        surfaces[name]["groundHeight"] = 60
    (OUT / "platform-surfaces.json").write_text(json.dumps(surfaces, indent=2) + "\n")


def export_ground_tiles() -> None:
    boards = [
        ("ground-kits-atlas-v1.png", PLATFORM_ORDER[:12], 13),
        ("ground-kits-moon-crystal-v1.png", PLATFORM_ORDER[12:], 2),
    ]
    for filename, names, detected_count in boards:
        source = chroma_alpha(Image.open(SOURCE / filename).convert("RGB"))
        bands = content_bands(source, detected_count)[:len(names)]
        for (top, bottom), name in zip(bands, names):
            row = source.crop((0, top, source.width, bottom))
            left, right = round(row.width / 3), round(row.width * 2 / 3)
            tile = row.crop((left, 0, right, row.height))
            bbox = tile.getbbox()
            if bbox is None:
                raise RuntimeError(f"No ground tile pixels found for {name}")
            tile = tile.crop(bbox)
            scale = 60 / tile.height
            tile = tile.resize((max(1, round(tile.width * scale)), 60), Image.Resampling.NEAREST)
            tile = opaque_ground_material(tile)
            # Mirror a clean interior half so both repeat boundaries are
            # pixel-identical; this removes visible vertical tile seams.
            inset = min(4, max(0, tile.width // 12))
            interior = tile.crop((inset, 0, tile.width - inset, tile.height))
            half = interior.crop((0, 0, max(1, interior.width // 2), interior.height))
            seamless = Image.new("RGBA", (half.width * 2, half.height), (0, 0, 0, 0))
            seamless.alpha_composite(half, (0, 0))
            seamless.alpha_composite(half.transpose(Image.Transpose.FLIP_LEFT_RIGHT), (half.width, 0))
            tile = seamless
            tile.save(OUT / f"ground-tile-{name}.png", optimize=True)


def export_slopes() -> None:
    source = chroma_alpha(Image.open(SOURCE / "slope-kits-atlas-v1.png").convert("RGB"))
    bands = content_bands(source, len(PLATFORM_ORDER))
    for (top, bottom), name in zip(bands, PLATFORM_ORDER):
        row = source.crop((0, top, source.width, bottom))
        for index, direction in enumerate(("up", "down")):
            left = round(row.width * index / 2)
            right = round(row.width * (index + 1) / 2)
            slope = row.crop((left, 0, right, row.height))
            bbox = slope.getbbox()
            if bbox is None:
                raise RuntimeError(f"No {direction} slope pixels found for {name}")
            # Register to a 2x runtime 45-degree canvas: 192px run, 192px rise,
            # plus a 48px solid underside. Runtime displays this at 96x120.
            registered = slope.crop(bbox).resize((192, 240), Image.Resampling.NEAREST)
            registered = despill_keyed_edges(registered)
            registered.save(OUT / f"slope-{name}-{direction}.png", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    export_backgrounds()
    export_platforms()
    export_ground_tiles()
    export_slopes()
    print(f"Exported 14 backgrounds and 14 platform kits to {OUT}")


if __name__ == "__main__":
    main()
