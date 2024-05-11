#!/bin/zsh

# ./_scripts/publish_post.sh

git add public/assets/posts _posts/;
git commit -m "BLOG POST :: '$(date)'";
git push origin main --force;