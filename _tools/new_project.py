#!/usr/bin/env python
"""Add a software project to /software, step by step, then open it in VS Code.

A wizard that asks for the project's name, pitch, links (GitHub, PyPI, npm, Docker
Hub, or any URL), install command, tech, status, and menu position, then writes
`_projects/<slug>.md` with the frontmatter filled in and the body sections from
`_templates/project.md` ready to write. Choosing a menu position that's taken moves
the projects at and after it down one.

Usage:
    ./_tools/new_project.py
"""

import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

import yaml
from rich.console import Console
from rich.markup import escape
from rich.panel import Panel
from rich.table import Table

from _prompts import ask, choose, confirm

console = Console()

# keep in sync with ProjectStatus in app/_lib/types/project.ts
PROJECT_STATUSES = [
    ("active", "active: being worked on"),
    ("maintained", "maintained: done, but fixes still happen"),
    ("wip", "wip: not ready yet"),
    ("archived", "archived: no longer worked on"),
]

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
ORDER_FIELD = re.compile(r"^order:.*$", re.MULTILINE)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def slugify(name: str) -> str:
    """Turn a project name into a URL slug, e.g. "Sleepy Bricks" -> "sleepy-bricks"."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def read_frontmatter(path: Path) -> dict:
    """Parse a Markdown file's YAML frontmatter, or return {} if it has none."""
    match = FRONTMATTER.match(path.read_text(encoding="utf-8"))
    return (yaml.safe_load(match.group(1)) or {}) if match else {}


def load_usernames(project_root: Path) -> dict[str, str]:
    """Read the GitHub and Docker Hub usernames from the profile URLs in data.yml."""
    data = yaml.safe_load(
        (project_root / "app" / "_lib" / "data.yml").read_text(encoding="utf-8")
    )
    return {
        "github": data["github_url"].rstrip("/").rsplit("/", 1)[-1],
        "dockerhub": data["dockerhub_url"].rstrip("/").rsplit("/", 1)[-1],
    }


def ask_links(slug: str, usernames: dict[str, str]) -> list[dict[str, str]]:
    """Ask for the project's links one at a time until "done" is picked.

    For the well-known sites only the repo or package name is asked for, and the URL
    is built from it.

    Args:
        slug: The project slug, offered as the default repo or package name.
        usernames: GitHub and Docker Hub usernames, from load_usernames().

    Returns:
        The links, each a {"display_text", "url"} dict, in the order added.
    """
    link_types = [
        ("github", "GitHub repo"),
        ("pypi", "PyPI package"),
        ("npm", "npm package"),
        ("dockerhub", "Docker Hub image"),
        ("other", "Some other URL (docs, demo, ...)"),
        ("done", "Done adding links"),
    ]
    links: list[dict[str, str]] = []

    while True:
        console.print()
        kind = choose(
            "[bold]Add a link.[/bold] Links show as buttons, in the order added:",
            link_types,
            default=len(link_types) if links else 1,
        )
        if kind == "done":
            return links

        if kind == "github":
            repo = ask(f"  Repo name on github.com/{usernames['github']}/", slug)
            url, display_text = (
                f"https://github.com/{usernames['github']}/{repo}",
                "GitHub",
            )
        elif kind == "pypi":
            package = ask("  PyPI package name", slug)
            url, display_text = f"https://pypi.org/project/{package}/", "PyPI"
        elif kind == "npm":
            package = ask("  npm package name", slug)
            url, display_text = f"https://www.npmjs.com/package/{package}", "npm"
        elif kind == "dockerhub":
            image = ask(
                f"  Image name on hub.docker.com/r/{usernames['dockerhub']}/", slug
            )
            url = f"https://hub.docker.com/r/{usernames['dockerhub']}/{image}"
            display_text = "Docker Hub"
        else:
            url = ask(
                "  URL",
                validate=lambda value: (
                    None if value.startswith("https://") else "Use a full https:// URL."
                ),
            )
            display_text = ""

        display_text = ask("  Button text", display_text or None)
        links.append({"display_text": display_text, "url": url})
        console.print(f"  [green]✓[/green] {escape(display_text)} → {escape(url)}")


def suggest_install(links: list[dict[str, str]]) -> str | None:
    """Guess the install command from the first PyPI, npm, or Docker Hub link."""
    for link in links:
        name = link["url"].rstrip("/").rsplit("/", 1)[-1]
        if "pypi.org" in link["url"]:
            return f"uv tool install {name}"
        if "npmjs.com" in link["url"]:
            return f"npm install {name}"
        if "hub.docker.com" in link["url"]:
            user = link["url"].rstrip("/").rsplit("/", 2)[-2]
            return f"docker run {user}/{name}"
    return None


def ask_position(projects: list[tuple[int, str, Path]]) -> int:
    """Show the current menu order and ask where the new project goes (1-based)."""
    last = len(projects) + 1
    if projects:
        console.print("\n[bold]Current menu order:[/bold]")
        for position, (_, name, _) in enumerate(projects, start=1):
            console.print(f"  [cyan]{position}[/cyan]  {escape(name)}")

    def check(value: str) -> str | None:
        if value.isdigit() and 1 <= int(value) <= last:
            return None
        return f"Pick a number from 1 to {last}."

    return int(ask(f"Menu position, 1 to {last}", str(last), validate=check))


def load_projects(projects_dir: Path) -> list[tuple[int, str, Path]]:
    """Return (order, name, path) for each existing project, in menu order."""
    projects = []
    for path in projects_dir.glob("*.md"):
        frontmatter = read_frontmatter(path)
        projects.append(
            (int(frontmatter.get("order") or 0), str(frontmatter.get("name")), path)
        )
    return sorted(projects, key=lambda project: (project[0], project[1]))


def renumber(projects: list[tuple[int, str, Path]], new_position: int) -> None:
    """Rewrite each project's `order:` as 1, 2, 3, ..., leaving a gap at new_position.

    Only the `order:` line of each file changes, and only if its number changes.

    Args:
        projects: Existing projects in menu order, from load_projects().
        new_position: The 1-based position the new project will take.
    """
    for index, (old_order, _, path) in enumerate(projects, start=1):
        order = index if index < new_position else index + 1
        if order != old_order:
            text = path.read_text(encoding="utf-8")
            path.write_text(
                ORDER_FIELD.sub(f"order: {order}", text, count=1), encoding="utf-8"
            )


class FrontmatterDumper(yaml.SafeDumper):
    """Writes lists of plain values inline (`tech: [python, typer]`) and everything
    else as indented blocks, like the hand-written project files."""


def represent_list(dumper: yaml.SafeDumper, items: list) -> yaml.Node:
    """Represent a list inline if it holds only plain values, else as a block."""
    inline = all(not isinstance(item, (dict, list)) for item in items)
    return dumper.represent_sequence("tag:yaml.org,2002:seq", items, flow_style=inline)


FrontmatterDumper.add_representer(list, represent_list)


def build_project_file(frontmatter: dict, template_path: Path, install: str) -> str:
    """Combine the frontmatter with the body sections from the project template.

    Args:
        frontmatter: The fields to write, in display order.
        template_path: `_templates/project.md`; its own frontmatter is replaced.
        install: Filled into the template's INSTALL placeholder.

    Returns:
        The full text of the new project file.
    """
    template = template_path.read_text(encoding="utf-8")
    body = FRONTMATTER.sub("", template, count=1).lstrip("\n")
    header = yaml.dump(
        frontmatter, Dumper=FrontmatterDumper, sort_keys=False, allow_unicode=True
    )
    return f"---\n{header}---\n\n{body.replace('INSTALL', install)}"


def open_in_editor(path: Path) -> None:
    """Open a file in VS Code, if its `code` command is installed."""
    if shutil.which("code") is None:
        console.print("[dim]`code` isn't on PATH, so open the file yourself.[/dim]")
        return
    subprocess.run(["code", str(path)], check=False)


def main() -> None:
    """Run the wizard, write the project file, and open it."""
    project_root = get_project_root()
    projects_dir = project_root / "_projects"
    template_path = project_root / "_templates" / "project.md"
    projects_dir.mkdir(exist_ok=True)

    console.print(
        Panel.fit(
            "Answer a few questions and this writes [bold]_projects/<slug>.md[/bold].\n"
            "Press Enter to take the default in [cyan](parentheses)[/cyan]. "
            "Ctrl+C cancels without writing anything.",
            title="🧰 New software project",
            border_style="bright_blue",
        )
    )

    name = ask("\n[bold]Project name[/bold] (as displayed)")
    slug = ask(
        "[bold]URL slug[/bold], as in sleepyblog.org/software/<slug>",
        slugify(name),
        validate=lambda value: (
            "Use lowercase letters, numbers, and dashes."
            if not SLUG.match(value)
            else (
                f"_projects/{value}.md already exists."
                if (projects_dir / f"{value}.md").exists()
                else None
            )
        ),
    )
    tagline = ask("[bold]Tagline[/bold]: one sentence that sells it")

    links = ask_links(slug, load_usernames(project_root))
    console.print()
    install = ask(
        "[bold]Install or run command[/bold], shown on the card", suggest_install(links)
    )
    tech = [
        item.strip()
        for item in ask(
            "[bold]Tech[/bold], comma-separated (e.g. python, typer)", required=False
        ).split(",")
        if item.strip()
    ]
    console.print()
    status = choose("[bold]Status:[/bold]", PROJECT_STATUSES)
    year = int(
        ask(
            "[bold]Year it started[/bold]",
            str(date.today().year),
            validate=lambda value: None if value.isdigit() else "Use a year like 2025.",
        )
    )
    featured = confirm(
        "[bold]Feature it[/bold] as a wide card at the top?", default=False
    )
    projects = load_projects(projects_dir)
    position = ask_position(projects)

    frontmatter = {
        "name": name,
        "tagline": tagline,
        "status": status,
        "year": year,
        "order": position,
        "featured": featured,
        "tech": tech,
        "install": install,
        "links": links,
        "media": [],
    }

    summary = Table.grid(padding=(0, 2))
    summary.add_column(style="bold")
    summary.add_column()
    for field in ["name", "tagline", "install", "status", "year"]:
        summary.add_row(field, escape(str(frontmatter[field])))
    summary.add_row("featured", "yes" if featured else "no")
    summary.add_row("tech", escape(", ".join(tech)) or "—")
    summary.add_row(
        "links", "\n".join(escape(link["display_text"]) for link in links) or "—"
    )
    summary.add_row("position", f"{position} of {len(projects) + 1}")
    console.print()
    console.print(Panel.fit(summary, title=f"_projects/{slug}.md", border_style="cyan"))

    if not confirm("Write it?", default=True):
        console.print("[dim]Cancelled. Nothing was written.[/dim]")
        return

    renumber(projects, position)
    project_path = projects_dir / f"{slug}.md"
    project_path.write_text(
        build_project_file(frontmatter, template_path, install), encoding="utf-8"
    )

    console.print(
        Panel.fit(
            f"[bold]_projects/{slug}.md[/bold] → /software/{slug}\n\n"
            "Next: write the pitch in the body (the sections are stubbed out),\n"
            "then preview with `npm run dev`.\n"
            f"Screenshots: drop them in _media_staging/ and run "
            f"./_tools/add_media.py --project {slug}",
            title="✅ Project created",
            border_style="bright_green",
        )
    )
    open_in_editor(project_path)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled. Nothing was written.[/dim]")
        sys.exit(130)
