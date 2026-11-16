#!/usr/bin/env python
"""Create a new blog post from the template and open it in VS Code.

Copies `_templates/yyyy-mm-dd.md` to `_posts/<date>.md`, using today's date unless one
is given, and fills in the post type when `--type` is passed.

Usage:
    ./_tools/new_post.py                          # today's date
    ./_tools/new_post.py 2025-01-20               # a specific date
    ./_tools/new_post.py --type land-development  # pre-fill the post type
"""

import argparse
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from rich.console import Console
from rich.panel import Panel

console = Console()

# keep in sync with `PostType` in app/_lib/types/post.ts
POST_TYPES = ["land-development", "software-development", "build-things", "rant"]


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def parse_date(value: str) -> str:
    """Validate a YYYY-MM-DD date string for argparse."""
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        raise argparse.ArgumentTypeError(f"'{value}' is not a YYYY-MM-DD date")
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
        default=datetime.now().strftime("%Y-%m-%d"),
        help="post date in YYYY-MM-DD format (default: today)",
    )
    parser.add_argument(
        "--type",
        "-t",
        choices=POST_TYPES,
        help="pre-fill the post type in the frontmatter",
    )
    return parser.parse_args()


def create_post(post_path: Path, template_path: Path, post_type: str | None) -> None:
    """Write a new post from the template, filling in the post type if one is given.

    Args:
        post_path: Where to write the new post.
        template_path: The post template to copy.
        post_type: Replaces the template's `TYPE` placeholder; left as-is if None.
    """
    content = template_path.read_text(encoding="utf-8")
    if post_type:
        content = re.sub(
            r'^type: "TYPE"', f'type: "{post_type}"', content, count=1, flags=re.M
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
    """Create the post, print next steps, and open it in VS Code."""
    args = parse_args()
    project_root = get_project_root()
    template_path = project_root / "_templates" / "yyyy-mm-dd.md"
    post_path = project_root / "_posts" / f"{args.date}.md"
    relative_post_path = post_path.relative_to(project_root)

    if not template_path.exists():
        console.print(f"[red]✗ Template not found at {template_path}[/red]")
        sys.exit(1)

    if post_path.exists():
        answer = console.input(
            f"[yellow]{relative_post_path} already exists. Overwrite it? \\[y/N]: [/yellow]"
        )
        if answer.strip().lower() not in ("y", "yes"):
            console.print("[dim]Cancelled.[/dim]")
            return

    create_post(post_path, template_path, args.type)

    fill_in = "title" if args.type else "title, type"
    console.print(
        Panel.fit(
            f"[bold]{relative_post_path}[/bold]\n\n"
            f"Next: fill in the frontmatter ({fill_in}), then write the post.\n"
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
