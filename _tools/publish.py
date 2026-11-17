#!/usr/bin/env python
"""Build-check, then commit and push all changes so Vercel deploys them.

Runs `./_tools/build.py` first and stops if it fails, so a broken build never gets
pushed. Then it shows what will be committed, asks for a commit message (unless `-m`
was given) and to confirm, commits everything (`git add -A`), and pushes the current
branch. Pushing `main` deploys to production;
any other branch gets a Vercel preview.

Usage:
    ./_tools/publish.py                    # asks for the commit message
    ./_tools/publish.py -m "fix typo"      # skips that question
"""

import argparse
import subprocess
import sys
from datetime import date
from pathlib import Path

from rich.console import Console
from rich.markup import escape

from _prompts import ask, confirm

console = Console()


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def parse_args() -> argparse.Namespace:
    """Parse the command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Build-check, then commit and push all changes.",
    )
    parser.add_argument(
        "-m",
        "--message",
        help='commit message (asked for if not given; suggests "sleepyblog post <today>")',
    )
    return parser.parse_args()


def git(*args: str, cwd: Path) -> str:
    """Run a git command and return its output, exiting if it fails."""
    result = subprocess.run(
        ["git", *args], cwd=cwd, capture_output=True, text=True, check=False
    )
    if result.returncode != 0:
        console.print(
            f"[red]✗ git {' '.join(args)} failed:[/red]\n{escape(result.stderr)}"
        )
        sys.exit(result.returncode)
    return result.stdout.rstrip()


def main() -> None:
    """Build, confirm, commit, and push."""
    args = parse_args()
    project_root = get_project_root()

    changes = git("status", "--short", cwd=project_root)
    if not changes:
        console.print("[yellow]Nothing to publish: no changes.[/yellow]")
        return

    build = subprocess.run([sys.executable, "_tools/build.py"], cwd=project_root)
    if build.returncode != 0:
        console.print("\n[red]✗ Build failed, so nothing was committed.[/red]")
        sys.exit(build.returncode)

    branch = git("branch", "--show-current", cwd=project_root)
    destination = "production" if branch == "main" else "a preview deployment"
    console.print(f"\n[bold]Changes to commit:[/bold]\n{escape(changes)}\n")
    message = args.message or ask(
        "[bold]Commit message[/bold]", f"sleepyblog post {date.today().isoformat()}"
    )
    if not confirm(f"Commit and push [bold]{branch}[/bold] to {destination}?"):
        console.print("[dim]Cancelled. Nothing was committed.[/dim]")
        return

    git("add", "-A", cwd=project_root)
    git("commit", "-m", message, cwd=project_root)
    console.print("⬆️  Pushing...")
    git("push", "-u", "origin", "HEAD", cwd=project_root)
    console.print(
        f"[bold green]✅ Pushed {branch}. Vercel is building {destination} now.[/bold green]"
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
