#!/usr/bin/env python3
"""Export and validate the complete 800x600 native runtime asset set.

This exporter never infers animation scale from visible bounds. It copies or
integer-resamples whole registered sheets, slices terrain on declared tile
boundaries, and rejects runtime assets that cannot render one source pixel to
one framebuffer pixel.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/assets"
OUT = SRC / "runtime-800"
CONTACT = ROOT / "tests/visual/runtime-800-contact.png"
MAPS = {
    "sprout-camp": 1152, "brambleway": 1440, "tidehollow": 1152,
    "gullhaven": 1440, "stonewatch": 1344, "greenbloom": 1440,
    "starwillow": 1344, "sunmeadow": 1344, "windroot": 1440,
    "saltwind": 1344, "rubblepass": 1344, "whispering-range": 1344,
    "moonlit-boughs": 1344, "crystal-hollow": 1344,
}
BACKGROUND_TOP_TRIMS = {"sunmeadow": 88}
NPCS = [p.stem.removeprefix("npc-") for p in (SRC / "imagegen-v1").glob("npc-*.png")]
ENEMIES = [p.stem.removeprefix("enemy-") for p in (SRC / "imagegen-v1").glob("enemy-*.png")]


def save_native(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGBA").save(path, optimize=False)


def expand_walk_cycle(image: Image.Image, frame_width: int) -> Image.Image:
    """Expand idle4+walk4 into idle4+registered walk8 without scaling."""
    if image.width != frame_width * 8:
        raise RuntimeError(f"motion sheet must contain 8 frames, got {image.size} for width {frame_width}")
    frames = [image.crop((i*frame_width,0,(i+1)*frame_width,image.height)) for i in range(8)]
    output = Image.new("RGBA", (frame_width*12,image.height),(0,0,0,0))
    for i in range(4): output.alpha_composite(frames[i],(i*frame_width,0))
    offsets = (1,-1,1,-1)
    cursor = 4
    for pose, offset in zip(frames[4:], offsets):
        output.alpha_composite(pose,(cursor*frame_width,0)); cursor += 1
        variant = Image.new("RGBA", pose.size,(0,0,0,0)); variant.alpha_composite(pose,(0,offset))
        output.alpha_composite(variant,(cursor*frame_width,0)); cursor += 1
    return output


def exact_canvas(image: Image.Image, size: tuple[int, int], label: str) -> Image.Image:
    if image.width < size[0] or image.height < size[1]:
        raise RuntimeError(f"{label}: source {image.size} is smaller than native canvas {size}")
    left = (image.width - size[0]) // 2
    top = (image.height - size[1]) // 2
    return image.crop((left, top, left + size[0], top + size[1]))


def pad_registered_frames(image: Image.Image, frame: tuple[int, int], padding: tuple[int, int]) -> Image.Image:
    """Add transparent safety bounds to every frame without scaling its pixels."""
    fw, fh = frame; px, py = padding
    if image.width % fw or image.height != fh:
        raise RuntimeError(f"registered sheet {image.size} does not match frame {frame}")
    output = Image.new("RGBA", ((fw + px * 2) * (image.width // fw), fh + py * 2), (0, 0, 0, 0))
    for index in range(image.width // fw):
        source = image.crop((index * fw, 0, (index + 1) * fw, fh))
        output.alpha_composite(source, (index * (fw + px * 2) + px, py))
    return output


def validate_frame_margins(image: Image.Image, frame: tuple[int, int], label: str, margin: int = 2) -> None:
    fw, fh = frame
    if image.width % fw or image.height != fh:
        raise RuntimeError(f"{label}: invalid registered sheet {image.size} for frame {frame}")
    for index in range(image.width // fw):
        bounds=image.crop((index*fw,0,(index+1)*fw,fh)).getchannel("A").getbbox()
        if bounds and (bounds[0]<margin or bounds[1]<margin or bounds[2]>fw-margin or bounds[3]>fh-margin):
            raise RuntimeError(f"{label} frame {index}: pixels violate {margin}px safety bounds: {bounds}")


def export_environments() -> dict:
    manifest = {}
    surfaces = json.loads((SRC / "environments-v1/platform-surfaces.json").read_text())
    for name, width in MAPS.items():
        for layer in ("back", "mid"):
            image = Image.open(SRC / f"environments-v1/{name}-{layer}.png").convert("RGBA")
            trim = BACKGROUND_TOP_TRIMS.get(name, 0) if layer == "back" else 0
            if trim:
                clean = image.crop((0, trim, image.width, image.height))
                repaired = Image.new("RGBA", image.size, (0,0,0,255))
                repaired.alpha_composite(clean, (0,0))
                last = clean.crop((0, clean.height-1, clean.width, clean.height))
                for y in range(clean.height, image.height): repaired.alpha_composite(last, (0,y))
                image = repaired
            save_native(exact_canvas(image, (width, 720), f"{name}-{layer}"), OUT / f"environments/{name}-{layer}.png")
        ground = Image.open(SRC / f"environments-v1/ground-tile-{name}.png").convert("RGBA")
        if ground.height != 60:
            raise RuntimeError(f"{name} ground height must be 60, got {ground.height}")
        save_native(ground, OUT / f"terrain/{name}-ground.png")
        platform = Image.open(SRC / f"environments-v1/platform-{name}.png").convert("RGBA")
        cap = 48
        if platform.width < cap * 2 + 8:
            raise RuntimeError(f"{name} platform source is too narrow for native caps")
        save_native(platform.crop((0, 0, cap, platform.height)), OUT / f"terrain/{name}-platform-left.png")
        center = platform.width // 2
        save_native(platform.crop((center - 32, 0, center + 32, platform.height)), OUT / f"terrain/{name}-platform-mid.png")
        save_native(platform.crop((platform.width - cap, 0, platform.width, platform.height)), OUT / f"terrain/{name}-platform-right.png")
        for direction in ("up", "down"):
            slope = Image.open(SRC / f"environments-v1/slope-{name}-{direction}.png").convert("RGBA")
            # Legacy slope boards were authored on a 2x source grid. Export
            # the complete frame once to its native 96x120 runtime canvas.
            slope = slope.resize((96, 120), Image.Resampling.NEAREST)
            save_native(slope, OUT / f"terrain/{name}-slope-{direction}.png")
        manifest[name] = {
            "width": width, "height": 720, "platformHeight": platform.height,
            "surfaceY": round(platform.height * surfaces[name]["surfaceRatio"]),
            "capWidth": cap, "middleWidth": 64, "groundHeight": 60,
        }
    return manifest


def export_actors() -> None:
    for name in NPCS:
        image = Image.open(SRC / f"imagegen-v1/npc-{name}.png").convert("RGBA")
        if image.size != (384, 128): raise RuntimeError(f"npc-{name}: expected 4x 96x128, got {image.size}")
        image = pad_registered_frames(image, (96, 128), (4, 4))
        validate_frame_margins(image,(104,136),f"npc-{name}")
        save_native(image, OUT / f"npcs/{name}.png")
    for name in ENEMIES:
        image = Image.open(SRC / f"imagegen-v1/enemy-{name}.png").convert("RGBA")
        if image.size != (576, 96): raise RuntimeError(f"enemy-{name}: expected 6x 96x96, got {image.size}")
        save_native(image, OUT / f"enemies/{name}.png")
    rig = SRC / "paperdoll-rig-v1"
    shutil.copytree(rig, OUT / "player-rig", dirs_exist_ok=True)
    legacy = OUT / "legacy-player"; legacy.mkdir(parents=True, exist_ok=True)
    body_sources = {
        "body-motion.png":"lumi-base-motion-v7.png", "body-air.png":"lumi-base-air-v7.png",
        "body-attack-none.png":"lumi-base-unarmed-v7.png", "body-attack-wood.png":"lumi-base-sword-v7.png",
        "body-attack-axe.png":"lumi-base-axe-v7.png",
    }
    for output, source in body_sources.items():
        image = Image.open(SRC / source).convert("RGBA")
        image = image.resize((image.width*2,image.height*2),Image.Resampling.NEAREST)
        if output == "body-motion.png": image = expand_walk_cycle(image, 96)
        save_native(image, legacy / output)
    equipment = legacy / "equipment"; equipment.mkdir(parents=True, exist_ok=True)
    for source in sorted((SRC / "paperdoll-v11").glob("*.png")):
        image = Image.open(source).convert("RGBA")
        image = image.resize((image.width*2,image.height*2),Image.Resampling.NEAREST)
        if source.stem.endswith("-motion"): image = expand_walk_cycle(image, 96)
        if source.stem.startswith("cape-"):
            frame_width = image.width // (12 if source.stem.endswith("-motion") else 4 if "attack" in source.stem else 2)
            image = pad_registered_frames(image, (frame_width, image.height), (4, 0))
        save_native(image, equipment / source.name)
    anchors = json.loads((SRC / "paperdoll-v11/anchors.json").read_text())
    for group in ("base", "clothes"):
        for anchor in anchors[group].values():
            anchor["width"] *= 2
            anchor["roots"] = [value * 2 for value in anchor["roots"]]
        roots = anchors[group]["motion"]["roots"]
        anchors[group]["motion"]["roots"] = roots[:4] + [value for root in roots[4:] for value in (root, root)]
    for transforms in anchors.get("socketDelta", {}).values():
        for transform in transforms:
            transform["x"] *= 2; transform["y"] *= 2
    motion_deltas = anchors.get("socketDelta", {}).get("motion", [])
    if motion_deltas:
        anchors["socketDelta"]["motion"] = motion_deltas[:4] + [dict(value) for transform in motion_deltas[4:] for value in (transform, transform)]
    (legacy / "anchors.json").write_text(json.dumps(anchors, indent=2)+"\n")


def contact_sheet() -> None:
    cells = []
    for name in sorted(NPCS):
        sheet = Image.open(OUT / f"npcs/{name}.png").convert("RGBA")
        cells.append((f"NPC {name}", sheet.crop((0, 0, 104, 136))))
    for name in sorted(ENEMIES):
        sheet = Image.open(OUT / f"enemies/{name}.png").convert("RGBA")
        cells.append((f"ENEMY {name}", sheet.crop((0, 0, 96, 96))))
    cols, cw, ch = 6, 128, 158
    rows = (len(cells) + cols - 1) // cols
    out = Image.new("RGBA", (cols*cw, rows*ch), (18, 27, 45, 255)); draw = ImageDraw.Draw(out)
    for i, (label, image) in enumerate(cells):
        x=(i%cols)*cw; y=(i//cols)*ch
        draw.rectangle((x,y,x+cw-1,y+ch-1),outline=(88,111,145,255));draw.text((x+4,y+3),label,fill=(240,240,224,255))
        out.alpha_composite(image,(x+(cw-image.width)//2,y+24))
    CONTACT.parent.mkdir(parents=True,exist_ok=True);out.save(CONTACT,optimize=False)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    environment_manifest = export_environments()
    export_actors()
    (OUT / "manifest.json").write_text(json.dumps({
        "format":"skyberry.runtime-assets/800x600-v1", "render":[800,600],
        "sampling":"nearest-1:1", "maps":environment_manifest,
        "npcs":sorted(NPCS), "enemies":sorted(ENEMIES),
    },indent=2)+"\n")
    contact_sheet()
    print(f"exported {len(MAPS)} maps, {len(NPCS)} NPCs, {len(ENEMIES)} enemies, and the player rig to {OUT}")


if __name__ == "__main__": main()
