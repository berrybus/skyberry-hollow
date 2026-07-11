# Skyberry Hollow

An original browser-first fantasy platform RPG prototype. It uses Phaser 3 from a CDN, so no build step is required.

## Play online

GitHub Pages deployment is configured in `.github/workflows/pages.yml`. After
this repository is pushed to GitHub, set **Settings → Pages → Source** to
**GitHub Actions**. Every push to `main` will publish the playable site.

Run it from this folder with a local static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Controls: Left/Right arrows move; Up uses nearby trail gates; E talks to NPCs and
closes dialogue; Space jumps; A uses the equipped class attack; I opens equipment. Click an inventory item to
inspect it, then use the explicit Equip or Unequip action.

The character starts as a Beginner on Dawnleaf Isle. Its Sprout Camp,
Brambleway, and Tidehollow Port maps are connected by explicit trail exits;
Captain Sol's ferry unlocks the separate Crownwind Reach network. Gullhaven,
Stonewatch, Greenbloom, and Starwillow each have their own bounded camera,
native-resolution layered pixel art, level layout, entrance spawns, and exits.
Brann, Lyra, and Orin offer combat trials
for permanent advancement into Warrior, Bowman, or Magician. Each path has its
own equipment set, stat growth, movement tuning, passive benefit, and attack
style: axe melee, arrows, or energy bolts. Enemies and berries grant XP; levels
add automatic class growth plus two stat points for STR, DEX, INT, or VIT.

The character menu has Gear, Stats, and Class views. Locked paths point the
player toward their Crownwind mentors, and class equipment is awarded
only after completing the matching advancement trial.

## Map pipeline

Map content lives in the declarative `MAP_DEFINITIONS` registry in
`src/main.js`. Each record owns its map bounds, named spawns, one-way platform
layout, NPC-safe ground zones, exits, enemies, and collectibles. The runtime
uses a short fade and a named destination spawn when crossing an exit, so maps
are isolated play spaces rather than distant segments of one continuous road.

Environment art is built at its final in-game dimensions—there is no resize or
downsampling step. Regenerate the seven native-resolution back and mid layers
with:

```bash
python3 scripts/build_map_assets.py
```

## Paper-doll pipeline

The customization system is asset-based rather than combination-based. Body,
hair, clothes, hats, capes, and future deforming wearables use matching,
untrimmed animation canvases. Rigid objects—such as weapons, projectiles, and
effects—use declared sockets with position, rotation, scale, and pivot data.
Items also declare front/back layers, hide/replace rules, draw-order variants,
and rig/body/animation compatibility metadata.

The first migrated vertical slice is the Beginner set. Its authored source
sheets and manifest live in `art/characters/lumi-v1`; the runtime reads the
packed atlas in `public/assets/paperdoll-rig-v1`. Other class sets continue to
use the legacy renderer until they are migrated individually. The old inferred
art generator is retired: do not use `build_equipment_variants.py` for new art.

Build and validate the rig, pack its atlas, produce the all-frames contact
sheet, and establish the visual baseline:

```bash
python3 scripts/paperdoll_pipeline.py
```

Verify a later change against that baseline:

```bash
python3 scripts/paperdoll_pipeline.py --verify-regression
```
