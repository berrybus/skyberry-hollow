# Lumi standard rig

`rig.json` is the authored contract for this character rig. It fixes animation
names, timing, canvas dimensions, roots, draw order, slot compatibility, and
rigid sockets. Add equipment by drawing full, untrimmed, frame-matched pixel
layers under `layers/<item>/`; do not derive a layer from a rendered character.

The exporter supports checked-in `.aseprite` / `.ase` files when Aseprite is
available, and packs their authored PNG exports without trimming or shifting
them. If a layer needs a different overlap on an attack frame, declare that in
the item and draw-order metadata rather than adding a socket correction.

The Beginner slice includes the complete body, tunic, cap, mantle, rigid sword
socket, and all idle/walk/jump/fall/attack frames. The inherited `short_brown_hair`
is explicitly marked as a legacy bundled body source, so the validator reports
it until an artist supplies separate `hair_back` and `hair_front` sheets. That
warning is intentional migration debt, not a runtime fallback or inferred art
operation.
