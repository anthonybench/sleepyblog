#!/bin/zsh

# ./_scripts/stub_post.sh yyyy-mm-dd

PATTERN='^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
POST_DATE=$1;

if [ $# -ne 1 ]; then
  echo "Usage: $0 <yyyy-mm-dd>"
  exit 1
fi
if [[ $1 =~ $PATTERN ]]; then
  echo "The argument '$1' follows the pattern."
else
  echo "Error. '$1' does not match form 'yyyy-mm-dd'."
  exit 1
fi

mkdir public/assets/posts/$POST_DATE
cp _templates/_posts/yyyy-mm-dd.md _posts/${POST_DATE}.md
echo "Post ${POST_DATE} stubbed."
code _posts/${POST_DATE}.md
exit 0
