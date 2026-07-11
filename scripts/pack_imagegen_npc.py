#!/usr/bin/env python3
"""Pack a 2x2 transparent ImageGen NPC atlas into the 104x136 runtime grid."""
import argparse
from pathlib import Path
from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    source = Image.open(args.input).convert("RGBA")
    cell_w, cell_h = source.width // 2, source.height // 2
    cells = [source.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h)) for row in range(2) for col in range(2)]
    bounds = [cell.getchannel("A").getbbox() for cell in cells]
    if any(bound is None for bound in bounds):
        raise SystemExit("Every frame must contain an opaque subject")
    max_w = max(bound[2] - bound[0] for bound in bounds)
    max_h = max(bound[3] - bound[1] for bound in bounds)
    scale = min(96 / max_w, 128 / max_h)
    sheet = Image.new("RGBA", (104 * 4, 136), (0, 0, 0, 0))
    for index, (cell, bound) in enumerate(zip(cells, bounds)):
        subject = cell.crop(bound)
        size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
        subject = subject.resize(size, Image.Resampling.NEAREST)
        x = index * 104 + (104 - size[0]) // 2
        y = 132 - size[1]
        sheet.alpha_composite(subject, (x, y))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.output, optimize=False)
    print(f"packed {args.output} at {sheet.size[0]}x{sheet.size[1]}")


if __name__ == "__main__":
    main()
