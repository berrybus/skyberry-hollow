#!/usr/bin/env python3
"""Deterministically author native-scale animated NPC sprites for the prototype."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib

NAMES = [
    'MIRA','CAPTAIN SOL','DOCKMASTER ORI','BRANN','LYRA','ORIN',
    'PERRIN','TESSA','NELL','PIP','MARLO','VENA','FINN','ADA','CORAL','HOLT','JUNE','BIX',
    'EMBER','ANVIL','ROOK','IONE','SAGE','FERN','WREN','TOBI','MOTE','VELA','ELIO','SURI',
]
OUT = Path(__file__).resolve().parents[1] / 'public/assets/npcs-v2'

def slug(name):
    return ''.join(c.lower() if c.isalnum() else '-' for c in name).strip('-').replace('--','-')

def palette(name):
    h = hashlib.sha256(name.encode()).digest()
    coat = (70+h[0]//2, 75+h[1]//2, 85+h[2]//2, 255)
    accent = (150+h[3]//3, 145+h[4]//3, 120+h[5]//2, 255)
    hair = (35+h[6]//4, 28+h[7]//5, 25+h[8]//5, 255)
    return coat, accent, hair

def rect(d, xy, color):
    d.rectangle(xy, fill=color)

def draw_frame(name, frame):
    im=Image.new('RGBA',(48,64),(0,0,0,0));d=ImageDraw.Draw(im)
    coat,accent,hair=palette(name); skin=(242,194,151,255); outline=(45,38,49,255)
    bob=[0,1,0,0][frame]; blink=frame==2; wave=frame==3
    # cape/back silhouette and feet
    rect(d,(15,35+bob,34,55+bob),outline);rect(d,(17,36+bob,32,54+bob),coat)
    rect(d,(17,53+bob,23,59+bob),outline);rect(d,(27,53+bob,33,59+bob),outline)
    rect(d,(16,58+bob,24,61+bob),(66,50,48,255));rect(d,(26,58+bob,34,61+bob),(66,50,48,255))
    # oversized expressive head with hair silhouette
    rect(d,(12,10+bob,36,33+bob),outline);rect(d,(14,12+bob,34,32+bob),skin)
    rect(d,(13,8+bob,35,17+bob),hair);rect(d,(11,13+bob,15,25+bob),hair);rect(d,(33,13+bob,37,24+bob),hair)
    # unique hat/accessory family determined by name hash
    variant=hashlib.md5(name.encode()).digest()[0]%5
    if variant==0: rect(d,(10,7+bob,38,11+bob),accent);rect(d,(16,3+bob,32,8+bob),accent)
    elif variant==1: rect(d,(17,4+bob,31,10+bob),accent);rect(d,(22,1+bob,26,5+bob),(238,213,119,255))
    elif variant==2: rect(d,(9,8+bob,39,11+bob),accent);rect(d,(14,5+bob,34,9+bob),coat)
    elif variant==3: rect(d,(31,7+bob,38,14+bob),accent);rect(d,(34,3+bob,36,9+bob),(228,231,151,255))
    else: rect(d,(11,8+bob,37,12+bob),accent);rect(d,(13,5+bob,18,9+bob),(241,184,113,255))
    eye=outline if not blink else skin
    if not blink: rect(d,(18,21+bob,20,23+bob),outline);rect(d,(28,21+bob,30,23+bob),outline)
    else: rect(d,(18,22+bob,20,22+bob),outline);rect(d,(28,22+bob,30,22+bob),outline)
    rect(d,(22,27+bob,27,28+bob),(173,91,91,255))
    # layered outfit, scarf/belt, hands and a periodic greeting
    rect(d,(14,34+bob,35,38+bob),accent);rect(d,(13,43+bob,36,47+bob),accent)
    rect(d,(11,36+bob,16,49+bob),outline);rect(d,(33,36+bob,38,49+bob),outline)
    if wave:
        rect(d,(35,27,39,45),outline);rect(d,(36,25,38,31),skin)
    else:
        rect(d,(10,47+bob,16,51+bob),skin);rect(d,(33,47+bob,39,51+bob),skin)
    # individual brooch pixel signature
    sig=hashlib.sha1(name.encode()).digest()[0]
    rect(d,(23,36+bob,25,38+bob),(120+sig//3,210-sig//4,190,255))
    return im

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    for name in NAMES:
        sheet=Image.new('RGBA',(192,64),(0,0,0,0))
        for frame in range(4):sheet.alpha_composite(draw_frame(name,frame),(frame*48,0))
        sheet.save(OUT/f'{slug(name)}.png',optimize=False)
    print(f'wrote {len(NAMES)} animated NPC sheets to {OUT}')

if __name__=='__main__':main()
