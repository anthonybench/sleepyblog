#!/bin/zsh

# ./_tools/check_interrogate

interrogate ./ -vv --fail-under=100 --exclude node_modules

exit 0
