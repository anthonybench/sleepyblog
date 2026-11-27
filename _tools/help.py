#!/usr/bin/env python
"""Show project stats, the post-and-deploy workflow, and the available tools and docs.

Tool descriptions come from the first line of each tool's module docstring, and doc
titles from each doc's first heading, so this never needs editing when a tool or doc
is added.

Usage:
    ./_tools/help.py
"""

import ast
import sys
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

WORKFLOW_STEPS = [
    (
        "1. Stub a post",
        "./_tools/new_post.py asks for the date, type, and title. "
        "(For /software, ./_tools/new_project.py instead.)",
    ),
    (
        "2. Add photos",
        "Drop them in _media_staging/ and run ./_tools/add_media.py. It asks which "
        "post or project they're for, uploads them, and adds the links to its "
        "[cyan]media:[/cyan] list. (For /furniture: ./_tools/add_media.py --furniture.)",
    ),
    ("3. Write & preview", "npm run dev → http://localhost:3000"),
    ("4. Format", "./_tools/format.py"),
    (
        "5. Publish",
        "./_tools/publish.py builds, then commits and pushes everything once you "
        "confirm. Vercel deploys every push on its own: main goes to production, any "
        "other branch gets a preview URL. There is no CI; the build check in "
        "publish.py is the only one.",
    ),
]


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def count_files(directory: Path, pattern: str) -> int:
    """Count the files in a directory that match a glob pattern."""
    return len(list(directory.glob(pattern))) if directory.is_dir() else 0


def get_tool_summary(tool_path: Path) -> str:
    """Return the first line of a Python tool's module docstring."""
    docstring = ast.get_docstring(ast.parse(tool_path.read_text(encoding="utf-8")))
    return docstring.splitlines()[0] if docstring else "No description"


def get_doc_title(doc_path: Path) -> str:
    """Return a markdown doc's first `# ` heading, or a dash if it has none."""
    in_code_block = False
    for line in doc_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("```"):
            in_code_block = not in_code_block
        elif not in_code_block and line.startswith("# "):
            return line[2:].strip()
    return "—"


def build_workflow_panel() -> Panel:
    """Build a panel listing the steps from new post to deployment."""
    grid = Table.grid(padding=(0, 2))
    grid.add_column(style="bold", no_wrap=True)
    grid.add_column()
    for step, instructions in WORKFLOW_STEPS:
        grid.add_row(step, instructions)
    return Panel(grid, title="🚀 Post & Deploy Workflow", border_style="bright_blue")


def build_counts_table(project_root: Path) -> Table:
    """Build a table of component, theme, post, and project counts."""
    table = Table(title="📊 Project Overview", header_style="bold magenta")
    table.add_column("Category", style="cyan")
    table.add_column("Count", justify="right", style="green")
    table.add_column("Location", style="dim")

    for category, location, pattern in [
        ("Components", "app/_components", "*.tsx"),
        ("Themes", "app/_lib/styles/themes", "*.css"),
        ("Posts", "_posts", "*.md"),
        ("Projects", "_projects", "*.md"),
    ]:
        count = count_files(project_root / location, pattern)
        table.add_row(category, str(count), f"{location}/")
    return table


def build_tools_table(tools_dir: Path) -> Table:
    """Build a table of the public tools in `_tools/` and what they do."""
    table = Table(title="🔧 Tools", header_style="bold blue")
    table.add_column("Tool", style="yellow", no_wrap=True)
    table.add_column("Description")

    for tool_path in sorted(tools_dir.glob("*.py")):
        if not tool_path.name.startswith("_"):
            table.add_row(f"./_tools/{tool_path.name}", get_tool_summary(tool_path))
    return table


def build_docs_table(docs_dir: Path) -> Table:
    """Build a table of the docs in `_docs/` and what they cover."""
    table = Table(title="📚 Docs (_docs/)", header_style="bold green")
    table.add_column("Doc", style="cyan", no_wrap=True)
    table.add_column("Title")

    for doc_path in sorted(docs_dir.glob("*.md")):
        table.add_row(doc_path.name, get_doc_title(doc_path))
    return table


def main() -> None:
    """Print the project overview."""
    project_root = get_project_root()

    console.print()
    console.print(
        Panel.fit("[bold bright_white]SleepyBlog Project Helper 📝[/bold bright_white]")
    )
    for section in [
        build_counts_table(project_root),
        build_workflow_panel(),
        build_tools_table(project_root / "_tools"),
        build_docs_table(project_root / "_docs"),
    ]:
        console.print()
        console.print(section)
    console.print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
