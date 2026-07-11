#!/usr/bin/env python3
"""Pack the curated NPC source lineup into consistent game-scale sprite frames."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/npc-source/mentor-lineup-v1.png"
OUT = ROOT / "public/assets/npcs-v1.png"
FRAME_W, FRAME_H, COUNT = 48, 64, 5


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    cell_width = source.width // COUNT
    sheet = Image.new("RGBA", (FRAME_W * COUNT, FRAME_H), (0, 0, 0, 0))
    for index in range(COUNT):
        cell = source.crop((index * cell_width, 0, (index + 1) * cell_width, source.height))
        bbox = cell.getchannel("A").getbbox()
        if not bbox:
            raise RuntimeError(f"NPC source cell {index} is empty")
        sprite = cell.crop(bbox)
        scale = min((FRAME_W - 4) / sprite.width, (FRAME_H - 2) / sprite.height)
        size = (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale)))
        sprite = sprite.resize(size, Image.Resampling.NEAREST)
        sheet.alpha_composite(sprite, (index * FRAME_W + (FRAME_W - size[0]) // 2, FRAME_H - size[1]))
    sheet.save(OUT, optimize=True)
    print(f"Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
