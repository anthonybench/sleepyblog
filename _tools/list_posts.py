#!/usr/bin/env python

from os import listdir

# ./_tools/list_posts.py

post_dir = "_posts"
sort = True

files = listdir(post_dir)
if sort:
    files.sort()
for post in [f for f in files]:
    print(post.split(".")[0])
