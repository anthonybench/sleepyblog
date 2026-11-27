# Software Projects (/software)

How the `/software` showcase works, and how to add or change a project.

## Adding a Project

```bash
./_tools/new_project.py
```

The wizard asks for:

| Question               | Notes                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| Project name           | As displayed, e.g. `sleepyconvert`                                                        |
| URL slug               | Defaults to the name; the page is `sleepyblog.org/software/<slug>`                        |
| Tagline                | One sentence that sells it. Shown on the card, the page, and the link preview             |
| Links                  | Pick GitHub / PyPI / npm / Docker Hub and give the repo or package name, or any other URL |
| Install or run command | Suggested from the first PyPI, npm, or Docker Hub link                                    |
| Tech                   | Comma-separated chips, e.g. `python, typer`                                               |
| Status                 | `active`, `maintained`, `wip`, or `archived`                                              |
| Year it started        | Shown as "since 2025"                                                                     |
| Feature it?            | Featured projects get a full-width card                                                   |
| Menu position          | Shows the current order; taking a used position moves the rest down one                   |

It writes `_projects/<slug>.md` and opens it in VS Code. Then:

1. **Write the body.** The template stubs out three sections: _Why it exists_, _What it does_, and _Quick start_. Write it to make someone want to try the project.
2. **Screenshots (optional).** Drop them in `_media_staging/` and run `./_tools/add_media.py --project <slug>` (or run it with no arguments and pick the project). It uploads to R2 and adds the links to the project's `media:` list, the same way it does for posts.
3. **Preview** with `npm run dev` at <http://localhost:3000/software>.
4. **Publish** with `./_tools/publish.py`.

## The Project File

Each project is one Markdown file in `_projects/`. The filename is the slug.

```yaml
---
name: sleepyconvert
tagline: Convert data, images, and documents between formats from one terse CLI.
status: active # active | maintained | wip | archived
year: 2025
order: 2 # menu position, lowest first
featured: false # true = full-width card at the top
tech: [python, typer, pandas]
install: uv tool install sleepyconvert
links:
    - display_text: PyPI
      url: https://pypi.org/project/sleepyconvert/
    - display_text: GitHub
      url: https://github.com/anthonybench/convert
media: [] # screenshot/GIF/video URLs, like a post's media
---
## Why it exists
...
```

| Field      | Required | Notes                                                                           |
| ---------- | -------- | ------------------------------------------------------------------------------- |
| `name`     | yes      | Display name                                                                    |
| `tagline`  | yes      | One sentence                                                                    |
| `install`  | yes      | One line. Shown on the card, and with a copy button on the page                 |
| `status`   | yes      | One of `active`, `maintained`, `wip`, `archived`                                |
| `year`     | no       | Defaults to the current year                                                    |
| `order`    | no       | Menu position, lowest first; ties are sorted by name                            |
| `featured` | no       | `true` makes the card span the full width. More than one is fine                |
| `tech`     | no       | List of chips                                                                   |
| `links`    | no       | Buttons, in this order. Each needs `display_text` (the button's text) and `url` |
| `media`    | no       | Shown as a gallery above the body. Use `add_media.py`, or paste any image URLs  |

**Mistakes fail the build.** A missing required field, an unknown status, or a link without `display_text` or `url` stops `npm run build` (and so `publish.py`) with a message naming the file, rather than silently dropping the project from the site.

**Link icons** are picked from the URL's host: `github.com`, `pypi.org`, `npmjs.com`, and `hub.docker.com` get their logos (in `public/static/`, and `public/{dark,light}/github.png`); anything else gets 🔗. To add one, extend `getLinkIcon` in `app/_components/ProjectLinks.tsx`.

**To reorder** by hand, change the `order:` numbers. To **retire** a project, set `status: archived`, or delete its file to remove it entirely.

**No metrics, on purpose.** The site never shows stars, downloads, or version badges. If you paste a README into a project body, leave its shields.io badges out.

## How It's Built

| Piece                             | File                                              |
| --------------------------------- | ------------------------------------------------- |
| Types and status list             | `app/_lib/types/project.ts`                       |
| Reading and checking `_projects/` | `app/_lib/utils/projects.ts`                      |
| Menu page                         | `app/software/page.tsx`                           |
| Terminal-window card              | `app/_components/ProjectCard.tsx`                 |
| Project page                      | `app/software/[slug]/page.tsx`                    |
| Link preview image                | `app/software/[slug]/opengraph-image.tsx`         |
| Copy-able install command         | `app/_components/CopyCommand.tsx`                 |
| Link buttons                      | `app/_components/ProjectLinks.tsx`                |
| Status badge                      | `app/_components/ProjectStatusBadge.tsx`          |
| Prev/next buttons (with posts)    | `app/_components/PrevNextNavigation.tsx`          |
| Styles                            | the "Software" section near the end of `main.css` |

- **Static pages.** Every project page and its link preview image are built at build time (`generateStaticParams`). An unknown slug is a 404.
- **The body** goes through the same Markdown renderer as posts, including syntax highlighting (see [Post Rendering System](post_rendering_system.md#syntax-highlighting)).
- **Link previews** use a generated card: install command, name, tagline, and URL, in the same frame as the other preview images (`app/_lib/og.tsx`).
