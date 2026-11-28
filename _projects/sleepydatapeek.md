---
name: sleepydatapeek
tagline: Peek at local data files fast, with instant summaries and shareable reports.
status: active
year: 2022
order: 2
featured: true
tech: [python, typer, pandas, weasyprint]
install: uv tool install sleepydatapeek
links:
    - display_text: PyPI
      url: https://pypi.org/project/sleepydatapeek/
    - display_text: GitHub
      url: https://github.com/anthonybench/datapeek
media: []
---

## Motivation

Before you can do anything with a data file, you need to know what's in it: how big it
is, what the columns are, and what a few rows look like. `sleepydatapeek` answers all
three in one command, without opening a notebook or a spreadsheet.

> How many sample rows to show and the table style live in a config file the tool stubs automatically for you to customize (`~/sleepyconfig/params.yml`). Other *sleepy-utils* I've made share this one config file too, see the PyPI or GitHub pages for more details.

## What it does

- **`summary`**: prints an overview, the schema, and a sample of any `csv`, `parquet`,
  `json`, `pkl`, or `xlsx` file. Point it at a PDF or image and you get its metadata.
- **`report`**: writes a Markdown report and a PDF with charts (null counts and distinct
  values per column), optionally grouped by a column, and copies the PDF to your
  clipboard so it's ready to send.
- **`about`**: prints the PyPI and GitHub links, and **`-v`** prints the version.

## Quick start

```sh
uv tool install sleepydatapeek     # or: pipx install sleepydatapeek
```

> Setting an alias like `alias datapeek=sleepydatapeek` is recommended for saving you precious key strokes 😎

```console
$ datapeek summary orders.parquet

╭─────────────┬───────────────────────────────────╮
│ File        │ /Users/dingus/work/orders.parquet │
├─────────────┼───────────────────────────────────┤
│ File size   │ 652.02 KB                         │
├─────────────┼───────────────────────────────────┤
│ Rows        │ 48213                             │
├─────────────┼───────────────────────────────────┤
│ Columns     │ 7                                 │
├─────────────┼───────────────────────────────────┤
│ Index       │ index                             │
├─────────────┼───────────────────────────────────┤
│ Index dtype │ int64                             │
╰─────────────┴───────────────────────────────────╯

Schema
╭────────────┬────────────────╮
│ ordered_at │ datetime64[ms] │
├────────────┼────────────────┤
│ region     │ str            │
├────────────┼────────────────┤
│ product    │ str            │
├────────────┼────────────────┤
│ qty        │ int64          │
├────────────┼────────────────┤
│ price      │ float64        │
├────────────┼────────────────┤
│ discount   │ float64        │
├────────────┼────────────────┤
│ status     │ str            │
╰────────────┴────────────────╯

Sample (5 rows)
╭────┬─────────────────────┬───────────┬─────────────────────┬───────┬─────────┬────────────┬───────────╮
│    │ ordered_at          │ region    │ product             │   qty │   price │   discount │ status    │
├────┼─────────────────────┼───────────┼─────────────────────┼───────┼─────────┼────────────┼───────────┤
│  0 │ 2025-01-01 00:17:22 │ us-west-2 │ oak bookshelf       │     2 │  404.44 │     nan    │ delivered │
├────┼─────────────────────┼───────────┼─────────────────────┼───────┼─────────┼────────────┼───────────┤
│  1 │ 2025-01-01 00:20:59 │ eu-west-1 │ maple console       │     1 │  480.68 │       0.05 │ delivered │
├────┼─────────────────────┼───────────┼─────────────────────┼───────┼─────────┼────────────┼───────────┤
│  2 │ 2025-01-01 00:35:28 │ eu-west-1 │ walnut coffee table │     4 │  668.19 │       0.1  │ delivered │
├────┼─────────────────────┼───────────┼─────────────────────┼───────┼─────────┼────────────┼───────────┤
│  3 │ 2025-01-01 00:45:14 │ eu-west-1 │ maple console       │     4 │  496.73 │     nan    │ delivered │
├────┼─────────────────────┼───────────┼─────────────────────┼───────┼─────────┼────────────┼───────────┤
│  4 │ 2025-01-01 00:58:31 │ us-east-1 │ pine bench          │     4 │  189.8  │       0.05 │ delivered │
╰────┴─────────────────────┴───────────┴─────────────────────┴───────┴─────────┴────────────┴───────────╯
```

PDF reports use [WeasyPrint](https://weasyprint.org/), which needs pango on your system
(`brew install pango` on macOS).
