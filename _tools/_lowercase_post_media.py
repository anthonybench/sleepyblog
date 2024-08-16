#!/usr/bin/env python

"""README
Changes filenames in target_dir to lowercase equivalent.

Usage:
    ./_tools/_lowercase_post_media.py
"""

import os

target_dir = "./media_staging"


def rename_to_lowercase(directory: str):
    """renames all files to lowercase equivalent"""
    for filename in os.listdir(directory):
        old_path = os.path.join(directory, filename)
        new_filename = filename.lower()
        new_path = os.path.join(directory, new_filename)

        if not filename == new_filename:
            os.rename(old_path, new_path)
            print(f"Renamed {filename} to {new_filename}")
        else:
            print(f"{filename} already lowercase")


rename_to_lowercase(target_dir)
exit(0)
