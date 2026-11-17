---
name: sleepybricks
tagline: Run Databricks operations across many workspaces from one terse CLI.
status: active
year: 2026
order: 1
featured: true
tech: [python, typer, databricks-sdk]
install: uv tool install sleepybricks
links:
    - display_text: PyPI
      url: https://pypi.org/project/sleepybricks/
    - display_text: GitHub
      url: https://github.com/anthonybench/bricks
media: []
---

## Why it exists

If you run more than one Databricks workspace (dev, staging, a region or two), the same
chore happens over and over: open each workspace, run the same query, click the same
button, copy the same secret. `sleepybricks` does it once, everywhere, and prints a tidy
table per workspace.

It authenticates from the `~/.databrickscfg` you already have, so there's nothing new to
set up. Every command takes a comma-separated list of profiles, like `dev,stg,us`.

## What it can do

- **`sql`**: run a statement (or a `.sql` file) on each workspace's serverless warehouse,
  total a column across all of them with `--sum`, or collect every row into one CSV
- **`run-job`**: trigger a job by name in each workspace
- **`grant`**: grant Unity Catalog privileges on a table, schema, or whole catalog
- **`write-secret` / `create-scope`**: keep secrets in sync everywhere
- **`put-file` / `propagate-file` / `pull-repo`**: ship notebooks and code to every workspace
- **`groups-audit`**: audit account-level groups and their members
- **`update-clusters`**: make sure you have a pinned, latest-LTS personal cluster in each one
- **`--json`** on any command, for piping into other tools

## Quick start

```sh
uv tool install sleepybricks       # or: pipx install sleepybricks
databricks configure --token       # once per workspace, if you haven't already
```

```console
$ sleepybricks sql -s "select region, count(*) tenants from tenants group by region" dev,stg

─── 👩‍💻 Development (dev) ───
region     tenants
---------  -------
us-west-2     1043
eu-west-1      512

─── 🔧 Staging (stg) ───
region     tenants
---------  -------
us-west-2       12
```
