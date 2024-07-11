#!/usr/bin/env python
import os

# ./_tools/_lowercase_post_media.py


def rename_to_lowercase(directory: str):
    """renames all"""
    for filename in os.listdir(directory):
        old_path = os.path.join(directory, filename)
        new_filename = filename.lower()
        new_path = os.path.join(directory, new_filename)

        if not filename == new_filename:
            os.rename(old_path, new_path)
            print(f"Renamed {filename} to {new_filename}")
        else:
            print(f"{filename} already lowercase")


rename_to_lowercase("./media_staging")
exit(0)
