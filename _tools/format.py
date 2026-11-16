#!/usr/bin/env python
"""Format the Python tools with black, and TS/TSX/CSS/Markdown with prettier.

Prettier reads its settings from `.prettierrc` (the same file VS Code's format-on-save
uses) and skips everything listed in `.gitignore` (node_modules, .next, _ephemeral, ...).
`.js` files are left out because prettier breaks `app/_lib/utils/loadConfig.js`.

Requires black (`pip install -r _tools/requirements.txt`) and prettier
(`brew install prettier`).

Usage:
    ./_tools/format.py
"""

import shutil
import subprocess
import sys
from pathlib import Path

from rich.console import Console

console = Console()

PRETTIER_GLOB = "**/*.{ts,tsx,css,md}"


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def run_formatter(label: str, command: list[str], cwd: Path) -> bool:
    """Run one formatter and report whether it succeeded.

    Args:
        label: Human-readable name of the formatter, printed before it runs.
        command: The command and its arguments; the first item must be on PATH.
        cwd: Directory to run the command in.

    Returns:
        True if the formatter ran and exited cleanly, False otherwise.
    """
    console.print(f"\n[bold cyan]{label}[/bold cyan]")
    if shutil.which(command[0]) is None:
        console.print(f"[red]✗ `{command[0]}` is not installed or not on PATH.[/red]")
        return False

    result = subprocess.run(command, cwd=cwd, check=False)
    if result.returncode != 0:
        console.print(f"[red]✗ {label} failed (exit code {result.returncode})[/red]")
        return False
    return True


def main() -> None:
    """Run every formatter, exiting non-zero if any of them failed."""
    project_root = get_project_root()

    results = [
        run_formatter("🐍 black", ["black", "_tools"], project_root),
        run_formatter(
            "💅 prettier",
            ["prettier", "--write", PRETTIER_GLOB],
            project_root,
        ),
    ]

    if not all(results):
        sys.exit(1)
    console.print("\n[bold green]✅ Formatting complete.[/bold green]")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
