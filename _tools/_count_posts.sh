#!/bin/zsh

# ./_tools/_count_posts.sh

echo "$(ls -1 _posts | wc -l | tr -d '[:blank:]')"
exit 0
