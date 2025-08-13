#!/bin/zsh

# ./_tools/format.sh

# python
black --line-length 88 --target-version py38 _tools/*.py
# javascript, typescript, html, markdown, css
prettier --write --tab-width 4 --print-width 100 **/*.md
prettier --write --tab-width 4 --print-width 100 **/*.ts
prettier --write --tab-width 4 --print-width 100 **/*.tsx
prettier --write --tab-width 4 --print-width 100 **/*.css
# prettier --write --tab-width 4 --print-width 100 **/*.js # breaks on `app/_lib/utils/loadConfig.js`
# shell scripts
shfmt -i 4 -ci -sr -w _tools/*.sh
