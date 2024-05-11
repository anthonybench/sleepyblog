#!/bin/zsh

# ./_scripts/stub_post.sh

POST_DATE=2024-05-10;

mkdir public/assets/posts/$POST_DATE;
cp _templates/_posts/yyyy-mm-dd.md _posts/${POST_DATE}.md