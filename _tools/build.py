#!/usr/bin/env python
"""Lint and build the project to catch errors before pushing.

Installs npm dependencies if `node_modules/` is missing, then runs `npm run lint` and
`npm run build`. There is no CI, so this is the check to run before pushing: if it
passes locally, the Vercel deployment should build too.

Usage:
    ./_tools/build.py
"""

import subprocess
import sys
from pathlib import Path

from rich.console import Console

console = Console()


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def run_step(label: str, command: list[str], cwd: Path) -> None:
    """Run one build step, exiting with the command's exit code if it fails.

    Args:
        label: Human-readable name of the step, printed before it runs.
        command: The command and its arguments.
        cwd: Directory to run the command in.
    """
    console.print(f"\n[bold cyan]{label}[/bold cyan] [dim]({' '.join(command)})[/dim]")
    result = subprocess.run(command, cwd=cwd, check=False)
    if result.returncode != 0:
        console.print(f"\n[red]✗ {label} failed (exit code {result.returncode})[/red]")
        sys.exit(result.returncode)


def main() -> None:
    """Install dependencies if needed, then lint and build."""
    project_root = get_project_root()
    console.print("🔧 Starting SleepyBlog build...")

    if not (project_root / "node_modules").is_dir():
        run_step("📦 Installing dependencies", ["npm", "install"], project_root)
    run_step("🔍 Linting", ["npm", "run", "lint"], project_root)
    run_step("🏗️  Building", ["npm", "run", "build"], project_root)

    console.print("\n[bold green]✅ Build completed successfully![/bold green]")
    console.print("[dim]Run `npm start` to serve the production build locally.[/dim]")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
