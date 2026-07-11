#!/usr/bin/env python3
"""Deprecated source-sheet normalizer.

Shared paper-doll canvases, roots, and animation frames are now authored in the
rig manifest and exported by paperdoll_pipeline.py. This compatibility entry
point deliberately performs no image analysis or pixel transformation.
"""

from paperdoll_pipeline import main


if __name__ == "__main__":
    main()
