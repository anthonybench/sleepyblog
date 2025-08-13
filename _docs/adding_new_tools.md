# Adding New Tools Guide

This guide explains how to add new tools to the SleepyBlog project's `_tools/` directory.

## Overview

SleepyBlog uses a collection of helper tools in the `_tools/` directory to automate common development tasks. These tools are automatically discovered and displayed by the `help.py` tool.

## Tool Structure

### Python Tools

Python tools should follow this structure:

```python
#!/usr/bin/env python
"""Tool Name

Longer description of what the tool does.

Usage:
    ./_tools/tool_name.py [options]
"""

import os
import sys
from pathlib import Path
from rich.console import Console  # For consistent formatting


def get_project_root() -> Path:
    """Get the project root directory"""
    return Path(__file__).parent.parent


def main():
    """Main function implementing the tool logic"""
    console = Console()
    # Tool implementation here


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
```

### Shell Script Tools

Shell script tools should follow this structure:

```bash
#!/bin/bash

# ./_tools/tool_name.sh

set -e

echo "🔧 Starting tool_name process..."

# Tool implementation here

echo "✅ Tool completed successfully!"
```

## Adding a New Tool

### Step 1: Create the Tool File

Create your tool file in the `_tools/` directory:

- **Python tools**: Use `.py` extension
- **Shell scripts**: Use `.sh` extension
- Make the file executable: `chmod +x _tools/your_tool.py`

### Step 2: Follow Naming Conventions

- Use lowercase with underscores: `new_tool.py`
- Prefix with underscore for internal tools: `_internal_tool.py`
- Use descriptive names that indicate the tool's purpose

### Step 3: Add Tool Description

Edit `_tools/help.py` and add your tool to the `tool_descriptions` dictionary (around line 63):

```python
tool_descriptions = {
    "build.sh": "Build the project (lint, build, and optimize)",
    "format.sh": "Format code files using prettier",
    "help.py": "Display project overview and help information",
    "new_post.py": "Create a new blog post from template with current date",
    "your_tool.py": "Brief description of what your tool does",  # Add this line
}
```

### Step 4: Test Your Tool

1. Run your tool directly: `./_tools/your_tool.py`
2. Verify it appears in help: `./_tools/help.py`
3. Test error handling and edge cases

## Best Practices

### Code Quality

- Follow the project's coding standards (see workspace rules)
- Add proper type hints for Python tools
- Include docstrings for all functions
- Use `camelCase` for function names, `lower_snake_case` for variables

### User Experience

- Use Rich library for consistent console output in Python tools
- Include emoji in status messages for visual appeal
- Provide clear error messages
- Handle `KeyboardInterrupt` gracefully

### File Organization

- Keep tools focused on a single responsibility
- Use the `get_project_root()` helper for path resolution
- Don't hardcode paths - use Path objects for cross-platform compatibility

### Documentation

- Include a clear docstring at the top of the file
- Document usage patterns and examples
- Keep descriptions in `help.py` concise but informative

## Examples

See existing tools for reference:

- `new_post.py` - Complex Python tool with argument parsing
- `build.sh` - Simple shell script with error handling
- `help.py` - Rich console output and project introspection

## Integration

New tools are automatically discovered by the help system. No additional configuration is needed beyond adding the description to `help.py`.
