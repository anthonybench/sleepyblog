#!/bin/zsh

# ./_tools/publish_post.sh

git add _posts/;
git commit -m "BLOG POST :: '$(date)'";
git push origin main --force;

exit 0
