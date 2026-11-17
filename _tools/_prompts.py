"""Shared interactive prompts for the `_tools/` wizards.

Not a tool itself (the leading underscore keeps it out of help.py). Tools import it as
`from _prompts import ask, choose, confirm`, which works because Python puts a script's
own directory on the import path.
"""

from collections.abc import Callable, Sequence
from typing import TypeVar

from rich.console import Console
from rich.markup import escape
from rich.prompt import Confirm, Prompt

console = Console()

T = TypeVar("T")


def ask(
    label: str,
    default: str | None = None,
    required: bool = True,
    validate: Callable[[str], str | None] | None = None,
) -> str:
    """Ask for a line of text, repeating until the answer is usable.

    Args:
        label: The question; rich markup is allowed.
        default: Used when Enter is pressed on an empty line (shown in brackets).
        required: Whether an empty answer is rejected (when there's no default).
        validate: Returns an error message for a bad answer, or None if it's fine.

    Returns:
        The answer, stripped of surrounding whitespace.
    """
    while True:
        answer = Prompt.ask(label, default=default, console=console) or ""
        answer = answer.strip()
        if not answer and required:
            console.print("[red]  An answer is required.[/red]")
            continue
        error = validate(answer) if validate and answer else None
        if error:
            console.print(f"[red]  {escape(error)}[/red]")
            continue
        return answer


def choose(label: str, options: Sequence[tuple[T, str]], default: int = 1) -> T:
    """Show a numbered list and return the value of the option picked.

    Args:
        label: The question; rich markup is allowed.
        options: (value, description) pairs, listed in order starting at 1.
        default: The 1-based option used when Enter is pressed.

    Returns:
        The chosen option's value.
    """
    console.print(label)
    for number, (_, description) in enumerate(options, start=1):
        console.print(f"  [cyan]{number}[/cyan]  {description}")
    numbers = [str(number) for number in range(1, len(options) + 1)]
    picked = Prompt.ask(
        "  Pick a number",
        choices=numbers,
        default=str(default),
        show_choices=False,
        console=console,
    )
    return options[int(picked) - 1][0]


def confirm(label: str, default: bool = False) -> bool:
    """Ask a yes/no question."""
    return Confirm.ask(label, default=default, console=console)
