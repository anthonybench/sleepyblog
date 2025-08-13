#!/usr/bin/env python
"""SleepyBlog Project Help Tool

Prints useful information about the project.

Usage:
    ./_tools/help.py
"""

import os
import sys
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.layout import Layout
from rich.columns import Columns


def get_project_root() -> Path:
    """Get the project root directory"""
    return Path(__file__).parent.parent


def count_files_in_directory(directory: Path, extension: str = None) -> int:
    """Count files in a directory with optional extension filter"""
    if not directory.exists():
        return 0

    if extension:
        return len(list(directory.glob(f"*.{extension}")))
    else:
        return len([f for f in directory.iterdir() if f.is_file()])


def get_component_count(project_root: Path) -> int:
    """Count React components in _components directory"""
    components_dir = project_root / "app" / "_components"
    return count_files_in_directory(components_dir, "tsx")


def get_theme_count(project_root: Path) -> int:
    """Count theme files in themes directory"""
    themes_dir = project_root / "app" / "_lib" / "styles" / "themes"
    return count_files_in_directory(themes_dir, "css")


def get_post_count(project_root: Path) -> int:
    """Count markdown posts in _posts directory"""
    posts_dir = project_root / "_posts"
    return count_files_in_directory(posts_dir, "md")


def get_tools_info(project_root: Path) -> list:
    """Get information about tools in _tools directory"""
    tools_dir = project_root / "_tools"
    tools = []

    if not tools_dir.exists():
        return tools

    tool_descriptions = {
        "build.sh": "Build the project (lint, build, and optimize)",
        "format.sh": "Format code files using prettier",
        "help.py": "Display project overview and help information",
        "new_post.py": "Create a new blog post from template with current date",
        "handle_media_files.sh": "Handle media files in _media_staging directory",
    }

    for tool_file in tools_dir.iterdir():
        if tool_file.is_file() and not tool_file.name.startswith("."):
            name = tool_file.name
            description = tool_descriptions.get(name, "No description available")
            tools.append((name, description))

    return sorted(tools)


def get_docs_info(project_root: Path) -> list:
    """Get information about documentation in _docs directory"""
    docs_dir = project_root / "_docs"
    docs = []

    if not docs_dir.exists():
        return docs

    doc_descriptions = {
        "stock_readme.md": "Standard README template and project information",
        "data_configuration.md": "Guide for adding and using configuration data in data.yml",
        "theme_system.md": "Complete guide to adding and customizing themes",
        "fonts_and_typography.md": "How to add fonts and manage typography",
        "post_rendering_system.md": "How posts are processed from markdown to HTML",
        "metadata_management.md": "Complete SEO and metadata management guide",
        "deployment.md": "Complete guide for development setup and production deployment",
        "initial_spec.md": "Original project specification and requirements",
    }

    for doc_file in docs_dir.iterdir():
        if doc_file.is_file() and not doc_file.name.startswith("."):
            name = doc_file.name
            description = doc_descriptions.get(name, "Documentation file")
            docs.append((name, description))

    return sorted(docs)


def create_counts_table(
    component_count: int, theme_count: int, post_count: int
) -> Table:
    """Create a table showing file counts"""
    table = Table(
        title="📊 Project Overview", show_header=True, header_style="bold magenta"
    )
    table.add_column("Category", style="cyan", width=20)
    table.add_column("Count", justify="right", style="green", width=10)
    table.add_column("Location", style="dim", width=30)

    table.add_row("Components", str(component_count), "app/_components/")
    table.add_row("Themes", str(theme_count), "app/_lib/styles/themes/")
    table.add_row("Posts", str(post_count), "_posts/")

    return table


def create_tools_table(tools: list) -> Table:
    """Create a table showing available tools"""
    table = Table(
        title="🔧 Available Tools", show_header=True, header_style="bold blue"
    )
    table.add_column("Tool", style="yellow", width=20)
    table.add_column("Description", style="white", width=50)

    for tool_name, description in tools:
        table.add_row(f"./_tools/{tool_name}", description)

    return table


def create_docs_table(docs: list) -> Table:
    """Create a table showing available documentation"""
    table = Table(
        title="📚 Available Documentation", show_header=True, header_style="bold green"
    )
    table.add_column("Document", style="cyan", width=20)
    table.add_column("Description", style="white", width=50)

    for doc_name, description in docs:
        table.add_row(doc_name, description)

    return table


def main():
    """Main function to display project help information"""
    console = Console()
    project_root = get_project_root()

    # Print header
    title = Text("SleepyBlog Project Helper", style="bold bright_white")
    subtitle = Text("📝", style="dim")

    console.print()
    console.print(Panel.fit(title, subtitle=subtitle, border_style="bright_blue"))
    console.print()

    # Get counts
    component_count = get_component_count(project_root)
    theme_count = get_theme_count(project_root)
    post_count = get_post_count(project_root)

    # Get tools and docs info
    tools = get_tools_info(project_root)
    docs = get_docs_info(project_root)

    # Display counts table
    console.print(create_counts_table(component_count, theme_count, post_count))
    console.print()

    # Display tools table
    if tools:
        console.print(create_tools_table(tools))
        console.print()

    # Display docs table
    if docs:
        console.print(create_docs_table(docs))
        console.print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)
    except Exception as e:
        console = Console()
        console.print(f"[red]Error: {e}[/red]")
        sys.exit(1)
