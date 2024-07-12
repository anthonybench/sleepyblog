#!/bin/zsh

# ./_tools/handle_media_files.sh <yyyy-mm-dd>

./_tools/_lowercase_post_media.py

export IMGUR_CLIENT_ID=$IMGUR_CLIENT_ID
export IMGUR_ACCESS_TOKEN=$IMGUR_ACCESS_TOKEN
./_tools/_imgur_upload.py

exit 0
