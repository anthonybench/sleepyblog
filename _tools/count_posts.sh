#!/bin/zsh

# ./_tools/count_posts.sh

echo "# of posts: $(ls -1 _posts | wc -l | tr -d '[:blank:]')"

exit 0
