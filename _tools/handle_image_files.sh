#!/bin/zsh

# ./_tools/handle_image_files.sh <yyyy-mm-dd>

POST_DATE=$1;
PATTERN='^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
PATTERN_READABLE='yyyy-mm-dd'

if [ $# -ne 1 ]; then
  echo "Usage: $0 <$PATTERN_READABLE>"
  exit 1
fi
if [[ $POST_DATE =~ $PATTERN ]]; then
  ./_tools/_lowercase_post_images.py $POST_DATE
  ./_tools/_print_post_media.py $POST_DATE
else
  echo "Error. '$POST_DATE' does not match form '$PATTERN_READABLE'."
  exit 1
fi

exit 0
