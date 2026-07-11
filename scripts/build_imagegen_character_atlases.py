#!/usr/bin/env python3
"""Normalize curated ImageGen boards into registered runtime sprite sheets."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/imagegen-source"
OUT = ROOT / "public/assets/imagegen-v1"

NPC_BOARDS = {
    "tidehollow-npcs-source-v1.png": ["captain-sol", "marlo", "vena", "finn", "ada"],
    "gullhaven-npcs-source-v1.png": ["dockmaster-ori", "coral", "holt", "june", "bix"],
    "stonewatch-npcs-source-v1.png": ["brann", "ember", "anvil", "rook", "ione"],
    "greenbloom-npcs-source-v1.png": ["lyra", "sage", "fern", "wren", "tobi"],
    "starwillow-npcs-source-v1.png": ["orin", "mote", "vela", "elio", "suri"],
}
ENEMIES = ["bramblehog", "tidecrab", "stonepup", "bloomcap", "starcrawler"]


def keyed(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, _ = pixels[x, y]
            alpha = 0 if r > 205 and b > 185 and g < 80 and r - g > 135 else 255
            pixels[x, y] = (r, g, b, alpha)
    return image


def grid_cells(source: Image.Image, rows: int, cols: int):
    result = []
    for row in range(rows):
        current = []
        for col in range(cols):
            box = (
                round(source.width * col / cols), round(source.height * row / rows),
                round(source.width * (col + 1) / cols), round(source.height * (row + 1) / rows),
            )
            current.append(keyed(source.crop(box)))
        result.append(current)
    return result


def subject(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    return image.crop(bbox) if bbox else Image.new("RGBA", (1, 1), (0, 0, 0, 0))


def main_component_bbox(image: Image.Image):
    """Return the largest connected opaque silhouette, ignoring held props."""
    alpha = image.getchannel("A")
    seen = set()
    largest = []
    for y in range(image.height):
        for x in range(image.width):
            if (x, y) in seen or alpha.getpixel((x, y)) == 0:
                continue
            stack = [(x, y)]; seen.add((x, y)); component = []
            while stack:
                px, py = stack.pop(); component.append((px, py))
                for nx, ny in ((px-1,py),(px+1,py),(px,py-1),(px,py+1)):
                    if 0 <= nx < image.width and 0 <= ny < image.height and (nx,ny) not in seen and alpha.getpixel((nx,ny)):
                        seen.add((nx,ny)); stack.append((nx,ny))
            if len(component) > len(largest): largest = component
    if not largest:
        return (0, 0, 1, 1)
    xs = [p[0] for p in largest]; ys = [p[1] for p in largest]
    return (min(xs), min(ys), max(xs)+1, max(ys)+1)


def normalize_row(cells, size, padding=4, align="bottom", lock_visible_size=False):
    subjects = [subject(cell) for cell in cells]
    if lock_visible_size:
        # Image-generated animation boards often contain subtle scale drift.
        # NPC idle poses do not change stature, so normalize every frame to one
        # authored visible height and a shared baseline before atlas export.
        # One animation-wide scale preserves stature while also fitting the
        # widest gesture. No frame is ever allowed to clip at its canvas edge.
        scale = min(
            (size[0] - padding * 2) / max(item.width for item in subjects),
            (size[1] - padding * 2) / max(item.height for item in subjects),
        )
        scales = [scale] * len(subjects)
    else:
        scale = min(
            (size[0] - padding * 2) / max(item.width for item in subjects),
            (size[1] - padding * 2) / max(item.height for item in subjects),
        )
        scales = [scale] * len(subjects)
    result = []
    for item, scale in zip(subjects, scales):
        resized = item.resize((max(1, round(item.width * scale)), max(1, round(item.height * scale))), Image.Resampling.NEAREST)
        canvas = Image.new("RGBA", size, (0, 0, 0, 0))
        x = (size[0] - resized.width) // 2
        y = size[1] - padding - resized.height if align == "bottom" else padding
        canvas.alpha_composite(resized, (x, y))
        result.append(canvas)
    return result


def lock_npc_sheet(path: Path) -> None:
    """Final non-mutating registration gate for every NPC source sheet."""
    source = Image.open(path).convert("RGBA")
    for index in range(4):
        frame = source.crop((index * 96, 0, (index + 1) * 96, 128))
        bounds=frame.getchannel("A").getbbox()
        if not bounds:raise RuntimeError(f"{path.name} frame {index} is empty")
        bx0, by0, bx1, by1 = bounds
        if bx0 < 4 or by0 < 4 or bx1 > 92 or by1 > 124:
            raise RuntimeError(f"{path.name} frame {index} violates the authored 4px safety margin: {(bx0,by0,bx1,by1)}")


def export_npcs() -> None:
    for filename, names in NPC_BOARDS.items():
        rows = grid_cells(Image.open(SOURCE / filename), 5, 4)
        for name, cells in zip(names, rows):
            frames = normalize_row(cells, (96, 128), 5, lock_visible_size=True)
            sheet = Image.new("RGBA", (96 * 4, 128), (0, 0, 0, 0))
            for index, frame in enumerate(frames):
                sheet.alpha_composite(frame, (index * 96, 0))
            sheet.save(OUT / f"npc-{name}.png", optimize=False)


def export_enemies() -> None:
    rows = grid_cells(Image.open(SOURCE / "enemies-source-v1.png"), 5, 6)
    for name, cells in zip(ENEMIES, rows):
        frames = normalize_row(cells, (96, 96), 5)
        sheet = Image.new("RGBA", (96 * 6, 96), (0, 0, 0, 0))
        for index, frame in enumerate(frames):
            sheet.alpha_composite(frame, (index * 96, 0))
        sheet.save(OUT / f"enemy-{name}.png", optimize=False)


def cape_frame(cell: Image.Image, size: tuple[int, int], root_x: int, neck_y: int, max_trail: int) -> Image.Image:
    item = subject(cell)
    # The ImageGen board is a front-facing garment concept. Register it as a
    # compact side-view back layer: clasp at the neck, hem above the canvas
    # bottom, and cloth trailing behind the body root.
    scale = min((size[0] - 6) / item.width, (size[1] - neck_y - 3) / item.height)
    item = item.resize((max(1, round(item.width * scale)), max(1, round(item.height * scale))), Image.Resampling.NEAREST)
    alpha = item.getchannel("A")
    top_band = max(2, round(item.height * .16))
    xs = [x for y in range(top_band) for x in range(item.width) if alpha.getpixel((x, y))]
    clasp_x = round(sum(xs) / len(xs)) if xs else item.width // 2
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = max(-item.width + 2, min(size[0] - 2, root_x - clasp_x))
    canvas.alpha_composite(item, (x, neck_y))
    pixels = canvas.load()
    for py in range(neck_y, size[1]):
        for px in range(size[0]):
            if px < root_x - max_trail or px > root_x + 3:
                pixels[px, py] = (0, 0, 0, 0)
    return canvas


def export_cape() -> None:
    rows = grid_cells(Image.open(SOURCE / "beginner-cape-source-v1.png"), 4, 4)
    specs = [
        (rows[0] + rows[1], (96, 128), 48, 38, 40, "motion.png"),
        (rows[2], (128, 128), 64, 34, 52, "air.png"),
        (rows[3], (192, 128), 96, 38, 60, "attack.png"),
    ]
    cape_dir = ROOT / "art/characters/lumi-v1/layers/cape-beginner"
    for cells, size, root_x, neck_y, max_trail, filename in specs:
        sheet = Image.new("RGBA", (size[0] * len(cells), size[1]), (0, 0, 0, 0))
        for index, cell in enumerate(cells):
            sheet.alpha_composite(cape_frame(cell, size, root_x, neck_y, max_trail), (index * size[0], 0))
        sheet.save(cape_dir / filename, optimize=False)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    export_npcs()
    export_enemies()
    export_cape()
    # Includes the five Sprout Camp sheets emitted by the companion source
    # board exporter, so every NPC passes through one final scale contract.
    for path in sorted(OUT.glob("npc-*.png")):
        lock_npc_sheet(path)
    print("Exported 25 NPC sheets, 5 enemy sheets, and corrected cape sources")


if __name__ == "__main__":
    main()
