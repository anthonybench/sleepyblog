#!/usr/bin/env python

from os import listdir

# ./_tools/list_posts.py

post_dir = "_posts"

for post in [f for f in listdir(post_dir)]:
    print(post.split(".")[0])
