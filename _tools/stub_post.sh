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

mkdir public/assets/posts/$POST_DATE
cp _templates/_posts/$PATTERN_READABLE.md _posts/${POST_DATE}.md
echo "Post ${POST_DATE} stubbed."
code _posts/${POST_DATE}.md

exit 0
