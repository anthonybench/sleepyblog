#!/usr/bin/env python
"""SleepyBlog New Post Generator

Creates a new blog post stub using the current date and the template file.

Usage:
    ./_tools/new_post.py
"""

import os
import sys
import shutil
import argparse
import re
from datetime import datetime
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
import subprocess


def get_project_root() -> Path:
    """Get the project root directory"""
    return Path(__file__).parent.parent


def get_current_date_slug() -> str:
    """Get current date in YYYY-MM-DD format"""
    return datetime.now().strftime("%Y-%m-%d")


def get_valid_post_types() -> list[str]:
    """Get list of valid post types"""
    return ["land-development", "software-development", "build-things", "rant"]


def validate_post_type(post_type: str) -> bool:
    """Validate if the post type is valid"""
    return post_type in get_valid_post_types()


def create_new_post(date_override: str = None, post_type: str = None) -> bool:
    """
    Create a new post from template

    Args:
        date_override: Optional date string in YYYY-MM-DD format
        post_type: Optional post type (land-development, software-development, build-things, rant)

    Returns:
        bool: True if successful, False otherwise
    """
    console = Console()
    project_root = get_project_root()

    # Use provided date or current date
    post_date = date_override if date_override else get_current_date_slug()

    # Validate date format
    try:
        datetime.strptime(post_date, "%Y-%m-%d")
    except ValueError:
        console.print(
            f"[red]Error: Invalid date format '{post_date}'. Use YYYY-MM-DD format.[/red]"
        )
        return False

    # Validate post type if provided
    if post_type and not validate_post_type(post_type):
        valid_types = ", ".join(get_valid_post_types())
        console.print(
            f"[red]Error: Invalid post type '{post_type}'. Valid types are: {valid_types}[/red]"
        )
        return False

    # Define paths
    template_path = project_root / "_templates" / "yyyy-mm-dd.md"
    posts_dir = project_root / "_posts"
    new_post_path = posts_dir / f"{post_date}.md"

    # Check if template exists
    if not template_path.exists():
        console.print(f"[red]Error: Template file not found at {template_path}[/red]")
        return False

    # Check if post already exists
    if new_post_path.exists():
        console.print(f"[yellow]Warning: Post {post_date}.md already exists![/yellow]")
        overwrite = (
            console.input("Do you want to overwrite it? [y/N]: ").lower().strip()
        )
        if overwrite not in ["y", "yes"]:
            console.print("[dim]Operation cancelled.[/dim]")
            return False

    # Create posts directory if it doesn't exist
    posts_dir.mkdir(exist_ok=True)

    try:
        # Copy template to new post
        shutil.copy2(template_path, new_post_path)

        # If post type is provided, replace the TYPE placeholder in the file
        if post_type:
            with open(new_post_path, "r", encoding="utf-8") as file:
                content = file.read()

            # Replace the TYPE placeholder with the actual post type
            content = re.sub(
                r'^type: "TYPE"', f'type: "{post_type}"', content, flags=re.MULTILINE
            )

            with open(new_post_path, "w", encoding="utf-8") as file:
                file.write(content)

        # Success message
        title = Text("✅ New Post Created!", style="bold bright_green")
        type_info = f"• Type: [cyan]{post_type}[/cyan]\n" if post_type else ""
        next_steps = (
            "1. Edit the post file to add your content\n2. Update the frontmatter (title, media)\n3. Write your post content in markdown"
            if post_type
            else "1. Edit the post file to add your content\n2. Update the frontmatter (title, media, type)\n3. Write your post content in markdown"
        )

        content = f"""
[cyan]{post_date}[/cyan]
{type_info}• File: [cyan]{new_post_path.relative_to(project_root)}[/cyan]
• Template: [dim]{template_path.relative_to(project_root)}[/dim]

[bold bright_yellow]Next Steps:[/bold bright_yellow]
{next_steps}

[bold bright_blue]Quick Commands:[/bold bright_blue]
• Open in editor: [cyan]code {new_post_path.relative_to(project_root)}[/cyan]
• View posts: [cyan]./_tools/help.py[/cyan]
        """

        console.print()
        console.print(
            Panel.fit(title, subtitle=content.strip(), border_style="bright_green")
        )
        console.print()

        subprocess.run(
            f"code {new_post_path.relative_to(project_root)}",
            shell=True,
            capture_output=False,
            text=True,
            executable="/bin/zsh",
        )

        return True

    except Exception as e:
        console.print(f"[red]Error creating post: {e}[/red]")
        return False


def main():
    """Main function"""
    console = Console()

    # Set up argument parser
    parser = argparse.ArgumentParser(
        description="Create a new blog post from template",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
Examples:
  {sys.argv[0]}                           Create post with today's date
  {sys.argv[0]} 2025-01-20               Create post with specific date
  {sys.argv[0]} --type software-development  Create post with specific type
  {sys.argv[0]} 2025-01-20 --type rant   Create post with date and type

Valid post types: {', '.join(get_valid_post_types())}
        """,
    )

    parser.add_argument(
        "date",
        nargs="?",
        help="Date for the post in YYYY-MM-DD format (defaults to today)",
    )
    parser.add_argument(
        "--type",
        "-t",
        choices=get_valid_post_types(),
        help="Post type (pre-fills the type field in frontmatter)",
    )

    # Parse arguments
    try:
        args = parser.parse_args()
    except SystemExit:
        return

    # Print header
    title = Text("SleepyBlog New Post Generator", style="bold bright_white")
    subtitle = Text("📝 Stub new post", style="dim")

    console.print()
    console.print(Panel.fit(title, subtitle=subtitle, border_style="bright_blue"))
    console.print()

    # Create the post
    success = create_new_post(args.date, args.type)

    if not success:
        sys.exit(1)


def show_help():
    """Show help information (kept for backward compatibility)"""
    console = Console()

    help_text = f"""
[bold bright_yellow]SleepyBlog New Post Generator[/bold bright_yellow]

[bold]Usage:[/bold]
  [cyan]./_tools/new_post.py[/cyan]                           Create post with today's date
  [cyan]./_tools/new_post.py 2025-01-20[/cyan]               Create post with specific date
  [cyan]./_tools/new_post.py --type software-development[/cyan] Create post with specific type
  [cyan]./_tools/new_post.py 2025-01-20 --type rant[/cyan]   Create post with date and type
  [cyan]./_tools/new_post.py --help[/cyan]                   Show detailed help message

[bold]Description:[/bold]
Creates a new blog post by copying the template file [cyan]_templates/yyyy-mm-dd.md[/cyan]
to [cyan]_posts/YYYY-MM-DD.md[/cyan] with the current or specified date and optional type.

[bold]Examples:[/bold]
  [cyan]./_tools/new_post.py[/cyan]                        → Creates _posts/2025-01-19.md
  [cyan]./_tools/new_post.py 2025-12-25[/cyan]            → Creates _posts/2025-12-25.md  
  [cyan]./_tools/new_post.py --type build-things[/cyan]   → Creates post with type pre-filled

[bold]Valid Post Types:[/bold]
{', '.join([f'[cyan]{t}[/cyan]' for t in get_valid_post_types()])}

[bold]Notes:[/bold]
• Date format must be YYYY-MM-DD
• Will prompt before overwriting existing posts
• Template file must exist in _templates/yyyy-mm-dd.md
• Post type will replace "TYPE" placeholder in template
    """

    console.print(Panel(help_text.strip(), title="Help", border_style="bright_yellow"))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console = Console()
        console.print("\n[dim]👋 Goodbye![/dim]")
        sys.exit(0)
    except Exception as e:
        console = Console()
        console.print(f"[red]Unexpected error: {e}[/red]")
        sys.exit(1)
