#!/bin/zsh

# ./_tools/stub_post.sh <yyyy-mm-dd>

POST_DATE=$1;
PATTERN='^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
PATTERN_READABLE='yyyy-mm-dd'

if [ $# -ne 1 ]; then
  echo "Usage: $0 <$PATTERN_READABLE>"
  exit 1
fi
if [[ $POST_DATE =~ $PATTERN ]]; then
  echo "Stubbing post for '$POST_DATE'..."
else
  echo "Error. '$POST_DATE' does not match form '$PATTERN_READABLE'."
  exit 1
fi

cp _templates/post/$PATTERN_READABLE.md _posts/${POST_DATE}.md
echo "Post ${POST_DATE} stubbed."
code _posts/${POST_DATE}.md
echo "Go add photos to media_staging (png, jpg, mp4)"
echo "There are now $(_tools/_count_posts.sh) posts."

exit 0
