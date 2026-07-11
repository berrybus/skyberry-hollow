#!/usr/bin/env python3
"""One-time deterministic import of the authored high-fidelity base body.

The output is registered against the existing rig canvases and roots. This is
an asset migration tool, not part of runtime export: it never subtracts
clothing, infers colors, or assembles outfit combinations.
"""

from pathlib import Path
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/assets"
BODY = ROOT / "art/characters/lumi-v1/layers/body"
CLOTHES = ROOT / "art/characters/lumi-v1/layers/clothes-beginner"


def cells(path: Path, count: int) -> list[Image.Image]:
    sheet = Image.open(path).convert("RGBA")
    return [sheet.crop((round(sheet.width*i/count), 0, round(sheet.width*(i+1)/count), sheet.height)) for i in range(count)]


def registered(source: Image.Image, reference: Image.Image, scale: float) -> Image.Image:
    source_box = source.getchannel("A").getbbox()
    target_box = reference.getchannel("A").getbbox()
    if not source_box or not target_box:
        raise RuntimeError("base-body migration encountered an empty frame")
    subject = source.crop(source_box)
    subject = subject.resize((max(1, round(subject.width*scale)), max(1, round(subject.height*scale))), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", reference.size, (0, 0, 0, 0))
    target_center = (target_box[0] + target_box[2]) // 2
    x = target_center - subject.width // 2
    y = target_box[3] - subject.height
    canvas.alpha_composite(subject, (x, y))
    return canvas


def head_width(frame: Image.Image) -> int:
    bounds=frame.getchannel("A").getbbox()
    if not bounds:return 0
    head=frame.crop((0,bounds[1],frame.width,min(frame.height,bounds[1]+45))).getchannel("A").getbbox()
    return 0 if not head else head[2]-head[0]


def reference_scale(source_name: str, output_path: Path, source_count: int, reference_count: int) -> float:
    source = cells(ASSETS / source_name, source_count)[0]
    reference_sheet = Image.open(output_path).convert("RGBA")
    reference = reference_sheet.crop((0, 0, reference_sheet.width // reference_count, reference_sheet.height))
    source_box=source.getchannel("A").getbbox();target_box=reference.getchannel("A").getbbox()
    if not source_box or not target_box:raise RuntimeError("cannot calculate authored base-body scale")
    return (target_box[3]-target_box[1])/(source_box[3]-source_box[1])


def migrate_sheet(source_name: str, output_path: Path, count: int, scale: float, source_indices: list[int] | None = None, reference_path: Path | None = None) -> None:
    reference_sheet = Image.open(reference_path or output_path).convert("RGBA")
    frame_width = reference_sheet.width // (len(source_indices) if source_indices else count)
    references = [reference_sheet.crop((i*frame_width, 0, (i+1)*frame_width, reference_sheet.height)) for i in range(reference_sheet.width//frame_width)]
    source_frames = cells(ASSETS / source_name, count)
    indices = source_indices or list(range(count))
    frames = [registered(source_frames[source_index], references[index],scale) for index, source_index in enumerate(indices)]
    output = Image.new("RGBA", (frame_width*len(frames), reference_sheet.height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        output.alpha_composite(frame, (index*frame_width, 0))
    output.save(output_path, optimize=False)


def main() -> None:
    # Four idle poses followed by four walk poses, each repeated to match the
    # authored eight-frame walk timing without inventing outfit combinations.
    body_scale=reference_scale("lumi-base-motion-alpha-v7.png",BODY/"motion.png",8,12)
    clothes_scale=reference_scale("lumi-clothes-motion-alpha-v9.png",CLOTHES/"motion.png",8,12)
    migrate_sheet("lumi-base-motion-alpha-v7.png",BODY/"motion.png",8,body_scale,[0,1,2,3,4,4,5,5,6,6,7,7])
    motion=Image.open(BODY/"motion.png").convert("RGBA").crop((0,0,96,128))
    air_reference=Image.open(BODY/"air.png").convert("RGBA").crop((128,0,256,128))
    air_source=cells(ASSETS/"lumi-base-air-alpha-v7.png",4)[1]
    trial=registered(air_source,air_reference,body_scale)
    air_scale=body_scale*head_width(motion)/max(1,head_width(trial))
    for _ in range(3):
        migrate_sheet("lumi-base-air-alpha-v7.png",BODY/"air.png",4,air_scale)
        migrated_air=Image.open(BODY/"air.png").convert("RGBA").crop((128,0,256,128))
        actual=head_width(migrated_air)
        if abs(actual-head_width(motion))<=1:break
        air_scale*=head_width(motion)/max(1,actual)
    air_sheet=Image.open(BODY/"air.png").convert("RGBA")
    for frame_index in (1,3):
        air_frame=air_sheet.crop((frame_index*128,0,(frame_index+1)*128,128))
        if abs(head_width(air_frame)-head_width(motion))>2:
            raise RuntimeError(f"air frame {frame_index} changes authored head scale")
    migrate_sheet("lumi-base-unarmed-alpha-v7.png",BODY/"attack.png",4,body_scale)
    migrate_sheet("lumi-clothes-unarmed-alpha-v9.png",CLOTHES/"attack.png",4,clothes_scale)
    migrate_sheet("lumi-base-sword-alpha-v7.png",BODY/"attack-wood.png",4,body_scale,reference_path=BODY/"attack.png")
    migrate_sheet("lumi-clothes-sword-alpha-v9.png",CLOTHES/"attack-wood.png",4,clothes_scale,reference_path=CLOTHES/"attack.png")
    # Hat and cape already align with the authored sword head/root positions;
    # give the weapon-specific animation its own immutable layer sources.
    for layer in ("hat-beginner","cape-beginner"):
        shutil.copyfile(ROOT/f"art/characters/lumi-v1/layers/{layer}/attack.png",ROOT/f"art/characters/lumi-v1/layers/{layer}/attack-wood.png")
    cape_motion=Image.open(ROOT/"art/characters/lumi-v1/layers/cape-beginner/motion.png").convert("RGBA")
    if cape_motion.width==96*8:
        source=[cape_motion.crop((i*96,0,(i+1)*96,128)) for i in range(8)]
        expanded=Image.new("RGBA",(96*12,128),(0,0,0,0))
        for i in range(4):expanded.alpha_composite(source[i],(i*96,0))
        for i in range(4):
            expanded.alpha_composite(source[4+i],((4+i*2)*96,0));expanded.alpha_composite(source[4+i],((5+i*2)*96,0))
        expanded.save(ROOT/"art/characters/lumi-v1/layers/cape-beginner/motion.png",optimize=False)
    print("migrated high-fidelity base body into the shared paper-doll rig")


if __name__ == "__main__":
    main()
