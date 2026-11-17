---
name: sleepyconvert
tagline: Convert data, images, and documents between formats from one terse CLI.
status: active
year: 2025
order: 2
featured: false
tech: [python, typer, pandas]
install: uv tool install sleepyconvert
links:
    - display_text: PyPI
      url: https://pypi.org/project/sleepyconvert/
    - display_text: GitHub
      url: https://github.com/anthonybench/convert
media: []
---

## Why it exists

Converting a CSV to Parquet, a PNG to a JPEG, or a Markdown file to a PDF shouldn't mean
looking up which library or website does it this week. `sleepyconvert` takes an input
path and an output path, and the two file extensions decide the rest. No subcommands, no
flags to memorize.

## What it converts

| Category      | Formats                                 |
| ------------- | --------------------------------------- |
| **Data**      | `csv`, `parquet`, `json`, `pkl`, `xlsx` |
| **Images**    | `png`, `jpg`, `jpeg`                    |
| **Documents** | `html`, `pdf`, `md`                     |

Any pair within a category works, in either direction.

## Quick start

```sh
uv tool install sleepyconvert      # or: pipx install sleepyconvert
```

```console
$ sleepyconvert sales.csv sales.parquet
Created /Users/dingus/work/sales.parquet

$ sleepyconvert notes.md notes.pdf
Created /Users/dingus/docs/notes.pdf
```
