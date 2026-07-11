#!/usr/bin/env python3
"""Deterministic Aseprite export, paper-doll validation, atlas packing, and visual regression.

This file deliberately does not inspect colors, infer masks, subtract completed
characters, recolor pixels, or repair registration.  Pixel layers in art/ are
the authored source of truth.  All source canvases remain untrimmed; the atlas
uses those same coordinates so every layer shares an exact origin at runtime.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "art/characters/lumi-v1"
MANIFEST_PATH = ART / "rig.json"
OUT = ROOT / "public/assets/paperdoll-rig-v1"
TESTS = ROOT / "tests/visual"
ATLAS_WIDTH = 1024
VALID_LAYER_SLOTS = {
    "body", "hair_back", "clothes_back", "cape_back", "weapon_back",
    "hair_front", "clothes_front", "hat_back", "hat_front", "cape_front",
    "weapon_front", "effects",
}
ITEM_SLOT_LAYERS = {
    "body": {"body"}, "hair": {"hair_back", "hair_front"},
    "clothes": {"clothes_back", "clothes_front"}, "hat": {"hat_back", "hat_front"},
    "cape": {"cape_back", "cape_front"}, "weapon": {"weapon_back", "weapon_front"},
}


class ValidationError(RuntimeError):
    pass


@dataclass(frozen=True)
class Frame:
    key: str
    image: Image.Image
    item_id: str
    layer: str
    animation: str
    index: int


def read_manifest() -> dict:
    manifest = json.loads(MANIFEST_PATH.read_text())
    if manifest.get("format") != "skyberry.paperdoll/1":
        raise ValidationError("Unsupported or missing paper-doll manifest format")
    return manifest


def export_aseprite_sources(aseprite: str | None) -> None:
    """Export checked-in .aseprite sources deterministically when a CLI is available.

    The current vertical slice uses curated PNG authoring exports.  Future
    authoring can add .aseprite files beside them; this exporter always writes
    to a sibling .png and never performs any image interpretation.
    """
    sources = sorted(ART.rglob("*.aseprite")) + sorted(ART.rglob("*.ase"))
    if not sources:
        return
    command = aseprite or shutil.which("aseprite")
    if not command:
        raise ValidationError("Aseprite source found but no aseprite CLI was supplied")
    for source in sources:
        output = source.with_suffix(".png")
        subprocess.run([command, "-b", str(source), "--save-as", str(output)], check=True)


def source_image(item: dict, layer: str, source_name: str) -> Image.Image:
    template = item["layers"][layer]["source"]
    path = ART / template.replace("{source}", source_name)
    if not path.exists():
        raise ValidationError(f"Missing authored sheet: {path.relative_to(ROOT)}")
    return Image.open(path).convert("RGBA")


def validate_manifest(manifest: dict) -> list[str]:
    errors: list[str] = []
    warnings: list[str] = []
    slots = set(manifest.get("slots", []))
    if slots != VALID_LAYER_SLOTS:
        errors.append("Rig slots must match the canonical front/back paper-doll slot set")
    order_names = set(manifest.get("drawOrder", {}))
    if not {"default", "attack"}.issubset(order_names):
        errors.append("Draw order must define default and attack variants")
    for name, order in manifest.get("drawOrder", {}).items():
        if set(order) != VALID_LAYER_SLOTS or len(order) != len(VALID_LAYER_SLOTS):
            errors.append(f"Draw order {name} must include each valid layer slot exactly once")

    rig = manifest.get("rig", {})
    for field in ("id", "version", "animationSet", "bodyType"):
        if not rig.get(field):
            errors.append(f"Rig compatibility metadata missing: {field}")

    animations = manifest.get("animations", {})
    for name, animation in animations.items():
        frames = animation.get("frames", [])
        canvas = animation.get("canvas", [])
        root = animation.get("root", [])
        if not frames or not isinstance(animation.get("fps"), (int, float)) or animation["fps"] <= 0:
            errors.append(f"Animation {name} has missing frames or invalid timing")
        if len(canvas) != 2 or min(canvas) <= 0:
            errors.append(f"Animation {name} has invalid canvas size")
        if len(root) != 2 or not (0 <= root[0] <= canvas[0] and 0 <= root[1] <= canvas[1]):
            errors.append(f"Animation {name} has invalid fixed root origin")
        # A root is intentionally animation-wide, never per-frame. This is
        # the structural check that prevents runtime root compensation.
        if isinstance(root[0] if root else None, list):
            errors.append(f"Animation {name} has a shifting per-frame root")

    for socket_name, socket_animations in manifest.get("sockets", {}).items():
        for animation_name, animation in animations.items():
            transforms = socket_animations.get(animation_name)
            if not transforms or len(transforms) != len(animation["frames"]):
                errors.append(f"Socket {socket_name}/{animation_name} has missing or mistimed frames")
                continue
            for index, transform in enumerate(transforms):
                if len(transform.get("position", [])) != 2 or len(transform.get("scale", [])) != 2 or len(transform.get("pivot", [])) != 2:
                    errors.append(f"Socket {socket_name}/{animation_name}/{index} has an invalid transform")
                if not isinstance(transform.get("rotation"), (int, float)):
                    errors.append(f"Socket {socket_name}/{animation_name}/{index} has invalid rotation")

    for item_id, item in manifest.get("items", {}).items():
        item_slot = item.get("slot")
        if item_slot not in ITEM_SLOT_LAYERS:
            errors.append(f"{item_id} has invalid equipment slot {item_slot}")
        for field in ("version", "bodyTypes", "rigs", "animationSet"):
            if not item.get(field):
                errors.append(f"{item_id} missing compatibility metadata: {field}")
        expected = ITEM_SLOT_LAYERS.get(item_slot, set())
        for layer in item.get("layers", {}):
            if layer not in VALID_LAYER_SLOTS or layer not in expected:
                errors.append(f"{item_id} declares invalid visual layer {layer}")
        for rule in item.get("hides", []) + item.get("replaces", []):
            if rule not in VALID_LAYER_SLOTS:
                errors.append(f"{item_id} refers to invalid hide/replace layer {rule}")
        if item_slot == "weapon" and not item.get("rigidAttachment"):
            errors.append(f"{item_id} must use a rigid socket attachment")
        if item.get("rigidAttachment"):
            socket = item["rigidAttachment"].get("socket")
            attachment_slot = item["rigidAttachment"].get("slot")
            if socket not in manifest.get("sockets", {}):
                errors.append(f"{item_id} refers to unknown socket {socket}")
            if attachment_slot not in {"weapon_back", "weapon_front", "effects"}:
                errors.append(f"{item_id} rigid attachment uses invalid slot {attachment_slot}")
        if not item.get("layers") and not item.get("rigidAttachment"):
            migration = item.get("migration", {})
            if not migration.get("renderedBy"):
                errors.append(f"{item_id} has no authored visual layers")
            else:
                warnings.append(f"{item_id}: temporary documented migration dependency on {migration['renderedBy']}")

    if errors:
        raise ValidationError("\n".join(errors))
    return warnings


def build_frames(manifest: dict) -> list[Frame]:
    frames: list[Frame] = []
    animations = manifest["animations"]
    for item_id, item in sorted(manifest["items"].items()):
        for layer in sorted(item.get("layers", {})):
            for animation_name, animation in animations.items():
                sheet = source_image(item, layer, animation["source"])
                width, height = animation["canvas"]
                if sheet.height != height or sheet.width % width:
                    raise ValidationError(
                        f"{item_id}/{layer}/{animation_name}: expected untrimmed {width}x{height} frames, got {sheet.size}"
                    )
                source_count = sheet.width // width
                for output_index, source_index in enumerate(animation["frames"]):
                    if source_index >= source_count:
                        raise ValidationError(f"{item_id}/{layer}/{animation_name}: missing source frame {source_index}")
                    box = (source_index * width, 0, (source_index + 1) * width, height)
                    image = sheet.crop(box)
                    frames.append(Frame(f"{item_id}/{layer}/{animation_name}/{output_index}", image, item_id, layer, animation_name, output_index))
    return frames


def pack_atlas(frames: list[Frame]) -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    x = y = row_height = 1
    placements: dict[str, tuple[int, int]] = {}
    ordered = sorted(frames, key=lambda frame: frame.key)
    for frame in ordered:
        if frame.image.width + 2 > ATLAS_WIDTH:
            raise ValidationError(f"Frame too wide for atlas: {frame.key}")
        if x + frame.image.width + 1 > ATLAS_WIDTH:
            x = 1
            y += row_height + 1
            row_height = 0
        placements[frame.key] = (x, y)
        x += frame.image.width + 1
        row_height = max(row_height, frame.image.height)
    height = y + row_height + 1
    atlas = Image.new("RGBA", (ATLAS_WIDTH, height), (0, 0, 0, 0))
    data = {"frames": {}, "meta": {"app": "skyberry-paperdoll-pipeline", "version": "1", "image": "atlas.png", "format": "RGBA8888", "size": {"w": ATLAS_WIDTH, "h": height}, "scale": "1"}}
    for frame in ordered:
        px, py = placements[frame.key]
        atlas.alpha_composite(frame.image, (px, py))
        width, height = frame.image.size
        data["frames"][frame.key] = {
            "frame": {"x": px, "y": py, "w": width, "h": height},
            "rotated": False, "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": width, "h": height},
            "sourceSize": {"w": width, "h": height}, "duration": 100,
        }
    atlas.save(OUT / "atlas.png", optimize=True)
    (OUT / "atlas.json").write_text(json.dumps(data, indent=2) + "\n")
    return data


def compose_loadout(manifest: dict, frame_lookup: dict[tuple[str, str, str, int], Image.Image], loadout_name: str, animation_name: str, index: int) -> Image.Image:
    animation = manifest["animations"][animation_name]
    width, height = animation["canvas"]
    active = manifest["representativeLoadouts"][loadout_name]
    hidden: set[str] = set()
    for item_id in active:
        item = manifest["items"][item_id]
        hidden.update(item.get("hides", []))
        hidden.update(item.get("replaces", []))
    result = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    order_name = "attack" if animation_name == "attack" else "default"
    for layer in manifest["drawOrder"][order_name]:
        if layer in hidden:
            continue
        for item_id in active:
            image = frame_lookup.get((item_id, layer, animation_name, index))
            if image:
                result.alpha_composite(image)
    # Rigid attachments stay out of deforming layers. The contact sheet marks
    # the authored socket position for every weapon frame so a registration
    # regression is visible without baking a weapon into an outfit sheet.
    root_x, root_y = animation["root"]
    for item_id in active:
        attachment = manifest["items"][item_id].get("rigidAttachment")
        if not attachment:
            continue
        socket = manifest["sockets"][attachment["socket"]][animation_name][index]
        socket_x, socket_y = socket["position"]
        marker_x, marker_y = round(root_x - socket_x), round(root_y + socket_y)
        draw = ImageDraw.Draw(result)
        draw.line((marker_x - 2, marker_y, marker_x + 2, marker_y), fill=(255, 218, 116, 255))
        draw.line((marker_x, marker_y - 2, marker_x, marker_y + 2), fill=(255, 218, 116, 255))
    return result


def write_contact_sheet(manifest: dict, frames: list[Frame], verify: bool) -> str:
    lookup = {(frame.item_id, frame.layer, frame.animation, frame.index): frame.image for frame in frames}
    cells: list[tuple[str, Image.Image]] = []
    for loadout_name in ("empty", "beginner"):
        for animation_name, animation in manifest["animations"].items():
            for index in range(len(animation["frames"])):
                image = compose_loadout(manifest, lookup, loadout_name, animation_name, index)
                cells.append((f"{loadout_name} {animation_name} {index} R", image))
                cells.append((f"{loadout_name} {animation_name} {index} L", image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)))
    cell_width, cell_height, label_height, columns = 108, 92, 14, 6
    rows = (len(cells) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * cell_width, rows * cell_height), (20, 29, 48, 255))
    draw = ImageDraw.Draw(sheet)
    for cell_index, (label, image) in enumerate(cells):
        col, row = cell_index % columns, cell_index // columns
        x, y = col * cell_width, row * cell_height
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline=(104, 135, 175, 255))
        draw.text((x + 3, y + 2), label, fill=(235, 241, 255, 255))
        preview = image
        available_height = cell_height - label_height - 4
        if preview.width > cell_width - 4 or preview.height > available_height:
            scale = min((cell_width - 4) / preview.width, available_height / preview.height)
            preview = preview.resize((round(preview.width * scale), round(preview.height * scale)), Image.Resampling.NEAREST)
        px = x + (cell_width - preview.width) // 2
        py = y + label_height + (cell_height - label_height - preview.height) // 2
        sheet.alpha_composite(preview, (px, py))
    TESTS.mkdir(parents=True, exist_ok=True)
    contact = TESTS / "paperdoll-rig-v1-contact.png"
    sheet.save(contact, optimize=True)
    digest = hashlib.sha256(contact.read_bytes()).hexdigest()
    baseline = TESTS / "paperdoll-rig-v1.baseline.sha256"
    if verify:
        if not baseline.exists():
            raise ValidationError("Visual baseline missing; run the pipeline once to establish it")
        if baseline.read_text().strip() != digest:
            raise ValidationError("Visual regression contact sheet changed")
    else:
        baseline.write_text(digest + "\n")
    return digest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--aseprite", help="Path to Aseprite CLI for authored .ase/.aseprite exports")
    parser.add_argument("--verify-regression", action="store_true")
    args = parser.parse_args()
    export_aseprite_sources(args.aseprite)
    manifest = read_manifest()
    warnings = validate_manifest(manifest)
    frames = build_frames(manifest)
    pack_atlas(frames)
    (OUT / "rig.json").write_text(json.dumps(manifest, indent=2) + "\n")
    digest = write_contact_sheet(manifest, frames, args.verify_regression)
    for warning in warnings:
        print(f"warning: {warning}")
    print(f"packed {len(frames)} frames; visual hash {digest}")


if __name__ == "__main__":
    main()
