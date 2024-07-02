#!/usr/bin/env python
import os
import re
from sys import argv

# ./_tools/lowwercase_post_images.py yyyy-mm-dd


def checkFormat(date_string):
    """checks if a string matches the yyyy-mm-dd format"""
    pattern = r"^\d{4}-\d{2}-\d{2}$"
    return bool(re.match(pattern, date_string))


def rename_to_lowercase(directory: str):
    """renames all"""
    for filename in os.listdir(directory):
        old_path = os.path.join(directory, filename)
        new_filename = filename.lower()
        new_path = os.path.join(directory, new_filename)

        os.rename(old_path, new_path)
        print(f"Renamed {filename} to {new_filename}")


# rename asset filenames & extensions to lowercase
if len(argv) > 1 and checkFormat(argv[1]):
    rename_to_lowercase(f"public/assets/posts/{argv[1]}")
    exit(0)
print(f"Usage: ./_tools/lowercase_files.py <yyyy-mm-dd>")
exit(1)
