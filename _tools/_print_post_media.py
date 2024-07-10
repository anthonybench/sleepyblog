#!/usr/bin/env python
import os
from sys import argv, exit
import re
from typing import List

# ./_tools/_print_post_media.py yyyy-mm-dd


def checkFormat(date_string: str):
    """checks if a string matches the yyyy-mm-dd format"""
    pattern = r"^\d{4}-\d{2}-\d{2}$"
    return bool(re.match(pattern, date_string))


def getFilenames(directory: str) -> List[str]:
    """reads the filenames in a directory and returns them as a list"""
    filenames = []
    for filename in os.listdir(directory):
        # Check if it's a file (not a directory) using os.path.isfile
        if os.path.isfile(os.path.join(directory, filename)):
            filenames.append(filename)
    return filenames


def printFormattedContents(directory: str) -> None:
    """reads the filenames, formats them, prints them"""
    filenames = getFilenames(directory)
    if filenames:
        formatted_filenames = [f'"{filename}"' for filename in filenames]
        print(f"[{', '.join(formatted_filenames)}]")
    else:
        print("No files found in the directory.")


# print format to copy/paste into post metadata field
if len(argv) > 1 and checkFormat(argv[1]):
    printFormattedContents(f"public/assets/posts/{argv[1]}")
    exit(0)
print(f"Usage: ./_tools/print_post_media.py <yyyy-mm-dd>")
exit(1)
