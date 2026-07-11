#!/usr/bin/env python3
"""Normalize the image-generated Sprout Camp source board into registered 2x sheets."""
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public/assets/imagegen-source/sprout-camp-atlas-source-v1.png'
OUT=ROOT/'public/assets/imagegen-v1'
NPCS=['mira','perrin','tessa','nell','pip']

def keyed(crop):
    px=crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r,g,b,a=px[x,y]
            if r>220 and b>220 and g<70: px[x,y]=(0,0,0,0)
    return crop

def normalized(crop,size,padding):
    crop=keyed(crop.convert('RGBA'))
    alpha=crop.getchannel('A')
    cols=[x for x in range(crop.width) if sum(alpha.getpixel((x,y))>0 for y in range(crop.height))>3]
    rows=[y for y in range(crop.height) if sum(alpha.getpixel((x,y))>0 for x in range(crop.width))>3]
    bbox=(min(cols),min(rows),max(cols)+1,max(rows)+1) if cols and rows else None
    canvas=Image.new('RGBA',size,(0,0,0,0))
    if not bbox:return canvas
    subject=crop.crop(bbox)
    max_w,max_h=size[0]-padding*2,size[1]-padding*2
    scale=min(max_w/subject.width,max_h/subject.height)
    subject=subject.resize((max(1,round(subject.width*scale)),max(1,round(subject.height*scale))),Image.Resampling.NEAREST)
    canvas.alpha_composite(subject,((size[0]-subject.width)//2,size[1]-padding-subject.height))
    return canvas

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    src=Image.open(SOURCE).convert('RGBA')
    row_bounds=[0,294,535,790,1018,1225]
    col_bounds=[0,256,512,744,src.width]
    for row,name in enumerate(NPCS):
        sheet=Image.new('RGBA',(96*4,128),(0,0,0,0))
        top,bottom=row_bounds[row],row_bounds[row+1]
        for frame in range(4):
            left,right=col_bounds[frame],col_bounds[frame+1]
            sheet.alpha_composite(normalized(src.crop((left,top,right,bottom)),(96,128),4),(frame*96,0))
        sheet.save(OUT/f'npc-{name}.png',optimize=False)
    enemy_top=round(src.height*.785);enemy_bottom=round(src.height*.902)
    enemy=Image.new('RGBA',(96*6,96),(0,0,0,0))
    for frame in range(6):
        left=round(frame*src.width/6);right=round((frame+1)*src.width/6)
        enemy.alpha_composite(normalized(src.crop((left,enemy_top,right,enemy_bottom)),(96,96),4),(frame*96,0))
    enemy.save(OUT/'enemy-spriglet.png',optimize=False)
    print(f'wrote Sprout Camp imagegen sheets to {OUT}')

if __name__=='__main__':main()
