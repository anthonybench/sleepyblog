---
name: sleepyconvert
tagline: Convert data, images, and documents between formats quickly.
status: active
year: 2025
order: 3
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

> There's an optional config file the tool stubs automatically for you to customize (`~/sleepyconfig/params.yml`). Set `convert_output_archive_dir` there and every conversion also drops a dated copy into that folder. Other *sleepy-utils* I've made share this one config file too, see the PyPI or GitHub pages for more details.

## What it converts

| Category      | Formats                                 |
| ------------- | --------------------------------------- |
| **Data**      | `csv`, `parquet`, `json`, `pkl`, `xlsx` |
| **Images**    | `png`, `jpg`, `jpeg`                    |
| **Documents** | `html`, `pdf`, `md`                     |

Any pair within a category works, in either direction.

Beyond converting, `sleepyconvert about` prints the PyPI and GitHub links, and
`sleepyconvert -v` prints the version.

## Quick start

```sh
uv tool install sleepyconvert      # or: pipx install sleepyconvert
```

> Setting an alias like `alias convert=sleepyconvert` is recommended for saving you precious key strokes 😎

```console
$ convert sales.csv sales.parquet
Created /Users/dingus/work/sales.parquet

$ convert notes.md notes.pdf
Created /Users/dingus/docs/notes.pdf
```
