#!/usr/bin/env python3
"""Deprecated entry point for the paper-doll asset pipeline.

Kept only so existing local commands fail forward into the non-generative
exporter. New equipment must be manually authored as layers in art/; this
command never examines pixels, extracts components, or recolors artwork.
"""

from paperdoll_pipeline import main


if __name__ == "__main__":
    main()
