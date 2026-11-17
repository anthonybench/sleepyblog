#!/usr/bin/env python
"""Create a new blog post from the template, step by step, and open it in VS Code.

Asks for the date (default: today), post type, and title, then copies
`_templates/yyyy-mm-dd.md` to `_posts/<date>.md` with those filled in. Anything passed
on the command line isn't asked for, so the flags are a shortcut past the questions.

Usage:
    ./_tools/new_post.py                                # asks for everything
    ./_tools/new_post.py 2025-01-20                     # a specific date
    ./_tools/new_post.py -t land-development -T "Title" # skip those questions
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from rich.console import Console
from rich.markup import escape
from rich.panel import Panel

from _prompts import ask, choose, confirm

console = Console()

# keep in sync with `PostType` in app/_lib/types/post.ts
POST_TYPES = ["land-development", "software-development", "build-things", "rant"]


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def date_error(value: str) -> str | None:
    """Return an error message if value isn't a YYYY-MM-DD date, else None."""
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return f"'{value}' is not a YYYY-MM-DD date"
    return None


def parse_date(value: str) -> str:
    """Validate a YYYY-MM-DD date string for argparse."""
    error = date_error(value)
    if error:
        raise argparse.ArgumentTypeError(error)
    return value


def parse_args() -> argparse.Namespace:
    """Parse the command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Create a new blog post from _templates/yyyy-mm-dd.md.",
    )
    parser.add_argument(
        "date",
        nargs="?",
        type=parse_date,
        help="post date in YYYY-MM-DD format (asked for if not given)",
    )
    parser.add_argument(
        "--type",
        "-t",
        choices=POST_TYPES,
        help="post type (asked for if not given)",
    )
    parser.add_argument(
        "--title",
        "-T",
        help="post title (asked for if not given)",
    )
    return parser.parse_args()


def create_post(
    post_path: Path, template_path: Path, post_type: str, title: str
) -> None:
    """Write a new post from the template with its type and title filled in.

    Args:
        post_path: Where to write the new post.
        template_path: The post template to copy.
        post_type: Replaces the template's `TYPE` placeholder.
        title: Replaces the template's `TITLE` placeholder.
    """
    content = template_path.read_text(encoding="utf-8")
    content = re.sub(
        r'^type: "TYPE"', f'type: "{post_type}"', content, count=1, flags=re.M
    )
    # json.dumps quotes and escapes the title the way YAML expects
    quoted_title = json.dumps(title, ensure_ascii=False)
    content = re.sub(
        r'^title: "TITLE"',
        lambda _: f"title: {quoted_title}",
        content,
        count=1,
        flags=re.M,
    )
    post_path.parent.mkdir(exist_ok=True)
    post_path.write_text(content, encoding="utf-8")


def count_staged_media(staging_dir: Path) -> int:
    """Count the non-hidden files waiting in `_media_staging/`."""
    if not staging_dir.is_dir():
        return 0
    return sum(
        1
        for path in staging_dir.iterdir()
        if path.is_file() and not path.name.startswith(".")
    )


def open_in_editor(path: Path) -> None:
    """Open a file in VS Code, if its `code` command is installed."""
    if shutil.which("code") is None:
        console.print("[dim]`code` isn't on PATH, so open the post yourself.[/dim]")
        return
    subprocess.run(["code", str(path)], check=False)


def main() -> None:
    """Ask for anything not given as a flag, create the post, and open it."""
    args = parse_args()
    project_root = get_project_root()
    template_path = project_root / "_templates" / "yyyy-mm-dd.md"

    if not template_path.exists():
        console.print(f"[red]✗ Template not found at {template_path}[/red]")
        sys.exit(1)

    post_date = args.date or ask(
        "[bold]Post date[/bold]",
        datetime.now().strftime("%Y-%m-%d"),
        validate=date_error,
    )
    post_path = project_root / "_posts" / f"{post_date}.md"
    relative_post_path = post_path.relative_to(project_root)

    if post_path.exists() and not confirm(
        f"[yellow]{relative_post_path} already exists. Overwrite it?[/yellow]"
    ):
        console.print("[dim]Cancelled.[/dim]")
        return

    post_type = args.type or choose(
        "[bold]Post type:[/bold]", [(post_type, post_type) for post_type in POST_TYPES]
    )
    title = args.title or ask("[bold]Title[/bold]")

    create_post(post_path, template_path, post_type, title)

    console.print(
        Panel.fit(
            f"[bold]{relative_post_path}[/bold]: {escape(title)}\n\n"
            "Next: replace the EXCERPT heading and write the post.\n"
            "Photos: drop them in _media_staging/ and run ./_tools/add_media.py",
            title="✅ New post created",
            border_style="bright_green",
        )
    )
    staged_count = count_staged_media(project_root / "_media_staging")
    if staged_count:
        console.print(
            f"📸 {staged_count} file(s) are waiting in _media_staging/. "
            "Run ./_tools/add_media.py to add them to this post."
        )
    open_in_editor(post_path)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
