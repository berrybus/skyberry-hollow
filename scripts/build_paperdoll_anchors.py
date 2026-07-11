#!/usr/bin/env python3
"""Deprecated: roots are authored in art/characters/lumi-v1/rig.json.

This compatibility command intentionally forwards to the deterministic
paper-doll validator. It no longer scans pixels to infer head/pelvis anchors or
emits runtime registration corrections.
"""

from paperdoll_pipeline import main


if __name__ == "__main__":
    main()
