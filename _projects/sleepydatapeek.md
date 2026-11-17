---
name: sleepydatapeek
tagline: Peek at local data files fast, with instant summaries and shareable reports.
status: active
year: 2022
order: 3
featured: false
tech: [python, typer, pandas, weasyprint]
install: uv tool install sleepydatapeek
links:
    - display_text: PyPI
      url: https://pypi.org/project/sleepydatapeek/
    - display_text: GitHub
      url: https://github.com/anthonybench/datapeek
media: []
---

## Why it exists

Before you can do anything with a data file, you need to know what's in it: how big it
is, what the columns are, and what a few rows look like. `sleepydatapeek` answers all
three in one command, without opening a notebook or a spreadsheet.

## What it does

- **`summary`**: prints an overview, the schema, and a sample of any `csv`, `parquet`,
  `json`, `pkl`, or `xlsx` file. Point it at a PDF or image and you get its metadata.
- **`report`**: writes a Markdown report and a PDF with charts (null counts and distinct
  values per column), optionally grouped by a column, and copies the PDF to your
  clipboard so it's ready to send.

## Quick start

```sh
uv tool install sleepydatapeek     # or: pipx install sleepydatapeek
```

```console
$ sleepydatapeek summary sales.csv

╭─────────────┬───────────╮
│ File        │ sales.csv │
├─────────────┼───────────┤
│ File size   │ 1.02 MB   │
├─────────────┼───────────┤
│ Rows        │ 15230     │
├─────────────┼───────────┤
│ Columns     │ 6         │
╰─────────────┴───────────╯
```

PDF reports use [WeasyPrint](https://weasyprint.org/), which needs pango on your system
(`brew install pango` on macOS).
