#!/bin/zsh

# ./_tools/count_posts.sh

echo "$(ls -1 _posts | wc -l | tr -d '[:blank:]') posts found"
exit 0
