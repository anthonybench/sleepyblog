#!/usr/bin/env python
"""Upload the photos in `_media_staging/` to imgur and print a `media:` line for a post.

Steps:
    1. Lowercase every filename in `_media_staging/`.
    2. Delete macOS `.DS_Store` files.
    3. Upload each file to imgur, in filename order.
    4. Group the uploads into a public imgur album named `sleepyblog_<yyyy_mm_dd>` and
       share it to the imgur gallery.
    5. Print a `media: [...]` line, ready to paste into the post's frontmatter.

Env vars (set them in your shell profile):
    IMGUR_CLIENT_ID     imgur app client id
    IMGUR_ACCESS_TOKEN  imgur app access token

Usage:
    ./_tools/handle_media_files.py

References:
    - package docs: https://imgur-python.readthedocs.io/en/latest/config/
    - package repo: https://github.com/faustocarrera/imgur-python
    - imgur api docs: https://apidocs.imgur.com/
"""

import os
import sys
import time
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from imgur_python import Imgur
from rich.console import Console

console = Console()

ALBUM_TIMEZONE = ZoneInfo("America/Los_Angeles")
# imgur needs a moment to finish processing uploads before they can join an album
ALBUM_CREATE_DELAY_SECONDS = 10


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def get_imgur_client() -> Imgur:
    """Build an imgur client from env vars, exiting if they aren't set."""
    client_id = os.getenv("IMGUR_CLIENT_ID")
    access_token = os.getenv("IMGUR_ACCESS_TOKEN")
    if not client_id or not access_token:
        console.print(
            "[red]✗ Set IMGUR_CLIENT_ID and IMGUR_ACCESS_TOKEN in your shell first.[/red]"
        )
        sys.exit(1)

    return Imgur(
        {"client_id": client_id, "access_token": access_token, "token_type": "bearer"}
    )


def prepare_staging_dir(staging_dir: Path) -> list[Path]:
    """Lowercase filenames, delete `.DS_Store`, and return the files to upload.

    Args:
        staging_dir: The `_media_staging/` directory.

    Returns:
        The files to upload, sorted by filename. Hidden files are skipped.
    """
    for path in sorted(staging_dir.iterdir()):
        if path.name.lower() == ".ds_store":
            path.unlink()
            continue
        lowercase_path = path.with_name(path.name.lower())
        if path.name != lowercase_path.name:
            path.rename(lowercase_path)
            console.print(f"[dim]Renamed {path.name} → {lowercase_path.name}[/dim]")

    return sorted(
        path
        for path in staging_dir.iterdir()
        if path.is_file() and not path.name.startswith(".")
    )


def upload_images(client: Imgur, files: list[Path], date_label: str) -> dict[str, str]:
    """Upload each file to imgur.

    Args:
        client: An authenticated imgur client.
        files: The files to upload, in the order they should appear in the post.
        date_label: Date string used in each image's description.

    Returns:
        A mapping of imgur image id to image link, in upload order.
    """
    images: dict[str, str] = {}
    for index, file in enumerate(files, start=1):
        console.print(f"⬆️  Uploading {file.name} ({index}/{len(files)})")
        response = client.image_upload(
            str(file),
            str(index),
            f"sleepyblog image {index}/{len(files)} for {date_label}",
        )
        data = response["response"]["data"]
        images[data["id"]] = data["link"]
    return images


def create_album(client: Imgur, image_ids: list[str], album_name: str) -> None:
    """Group the uploaded images into a public album and share it to the gallery."""
    time.sleep(ALBUM_CREATE_DELAY_SECONDS)
    album = client.album_create(image_ids, album_name, album_name, "public")
    album_id = album["response"]["data"]["id"]
    client.gallery_album(album_id, album_name, 0, "")


def main() -> None:
    """Prepare the staging directory, upload its files, and print the media links."""
    staging_dir = get_project_root() / "_media_staging"
    if not staging_dir.is_dir():
        console.print(f"[red]✗ {staging_dir} doesn't exist.[/red]")
        sys.exit(1)

    client = get_imgur_client()
    files = prepare_staging_dir(staging_dir)
    if not files:
        console.print("[yellow]Nothing to upload: _media_staging/ is empty.[/yellow]")
        return

    date_label = datetime.now(ALBUM_TIMEZONE).strftime("%Y_%m_%d")
    images = upload_images(client, files, date_label)

    album_name = f"sleepyblog_{date_label}"
    try:
        create_album(client, list(images), album_name)
        console.print(f"[green]📁 Created album {album_name}[/green]")
    except Exception as error:  # the uploads still worked, so keep going
        console.print(
            f"[yellow]⚠️  Album {album_name} wasn't created: {error}[/yellow]"
        )

    console.print("\n[bold]Paste this into the post's frontmatter:[/bold]\n")
    print(f"media: {list(images.values())}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
