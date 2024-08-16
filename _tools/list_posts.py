#!/usr/bin/env python

"""README
Simply prints posts (contents of _posts/) line by line, without the file extension

Usage:
    ./_tools/list_posts.py
"""

from os import listdir


post_dir = "_posts"
sort = True

files = listdir(post_dir)
if sort:
    files.sort()
for post in [f for f in files]:
    print(post.split(".")[0])
