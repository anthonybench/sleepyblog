# Adding New Tools Guide

This guide explains how to add a helper tool to `_tools/`.

## Overview

Every tool in `_tools/` is a standalone, executable Python script. `./_tools/help.py` finds them automatically and lists each one with the first line of its module docstring, so a new tool needs no registration.

Install the Python dependencies once:

```bash
pip install -r _tools/requirements.txt
```

## Conventions

- **Python only.** No shell scripts; run other commands with `subprocess.run([...])`.
- **Naming:** `lower_snake_case.py`. Prefix a file with `_` to hide it from `help.py` (for shared or internal modules).
- **Executable:** start with `#!/usr/bin/env python` and run `chmod +x _tools/your_tool.py`.
- **Module docstring:** the first line is a one-sentence summary (`help.py` shows it), followed by details and a `Usage:` section.
- **Function docstrings and type hints on every function.**
    - Simple or obvious functions get a one-line docstring saying what they do.
    - Anything more involved gets a Google-style docstring with `Args:` and `Returns:` sections.
- **Paths:** resolve everything from `get_project_root()` so a tool works from any directory.
- **Output:** use a module-level `rich` `Console`. Print errors in red and exit non-zero.
- **Ask, don't require flags.** Tools that need input work as wizards: anything not passed on the command line is asked for, with a sensible default where there is one, so a tool is easy to use after months away. Flags stay as shortcuts. Use the shared helpers in `_tools/_prompts.py`:
    - `ask(label, default=None, required=True, validate=None)`: a line of text; `validate` returns an error message or `None`
    - `choose(label, [(value, description), ...], default=1)`: a numbered menu
    - `confirm(label, default=False)`: yes/no

    Import them with `from _prompts import ask, choose, confirm` (Python puts the script's own directory on the import path). rich shows defaults in parentheses, so phrase hints without them, e.g. `"Menu position, 1 to 5"`.

- **Formatting:** run `./_tools/format.py`, which runs black with its defaults.

## Template

```python
#!/usr/bin/env python
"""One-sentence summary of what the tool does.

More detail about what it does, what it reads or writes, and any env vars it needs.

Usage:
    ./_tools/your_tool.py
"""

import sys
from pathlib import Path

from rich.console import Console

console = Console()


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def main() -> None:
    """Run the tool."""
    project_root = get_project_root()
    # Tool implementation here


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
```

## Checklist

1. Create `_tools/your_tool.py` from the template and make it executable.
2. Add any new pip dependencies to `_tools/requirements.txt`.
3. Run it: `./_tools/your_tool.py`
4. Check it's listed correctly: `./_tools/help.py`
5. Format: `./_tools/format.py`

## Examples

- `new_post.py`: a short wizard where every question can also be passed as a flag, file templating
- `new_project.py`: a longer wizard (looping menus, validation, a summary before writing), writing YAML frontmatter
- `build.py` / `format.py`: running external commands and reporting failures
- `add_media.py`: env vars, image processing with Pillow, calling an external API, editing frontmatter, picking a target from a menu
- `help.py`: rich tables and reading other files' docstrings
