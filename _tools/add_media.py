#!/usr/bin/env python
"""Upload the photos in `_media_staging/` to R2 and add them to a post or project.

Drop the photos (and videos) into `_media_staging/`, then run this. It asks where they
go (the newest post, another post, or a /software project), then:
    1. Fixes each photo's rotation, strips its metadata (including GPS location), and
       shrinks it to at most 2560px on the long edge as a JPEG. iPhone HEIC photos
       are converted too. GIFs and videos are uploaded as-is.
    2. Uploads everything to the Cloudflare R2 bucket behind media.sleepyblog.org, in
       the order the photos were taken. Each file gets a random name, and each photo
       also gets a 1024px copy with an "h" suffix (`<id>.jpg` + `<id>h.jpg`), which
       the post gallery loads as its thumbnail.
    3. Appends the links to the post's or project's `media:` list.
    4. Moves the originals to `_media_staging/uploaded/<slug>/`, so nothing is ever
       uploaded twice.

Naming a post or project on the command line skips the question. It always shows the
plan and asks before uploading. If an upload fails partway, the files that made it are
still added, and re-running uploads the rest.

Env vars (set them in your shell profile):
    R2_ACCOUNT_ID         Cloudflare account id
    R2_ACCESS_KEY_ID      R2 API token's access key id
    R2_SECRET_ACCESS_KEY  R2 API token's secret access key
    R2_BUCKET             bucket name (sleepyblog-media)

Usage:
    ./_tools/add_media.py                       # asks where the media goes
    ./_tools/add_media.py 2025-11-19            # a specific post
    ./_tools/add_media.py --project sleepyconvert  # a /software project
    ./_tools/add_media.py --dry-run             # process the photos, show the plan only

References:
    - R2 with boto3: https://developers.cloudflare.com/r2/examples/aws/boto3/
"""

import argparse
import mimetypes
import os
import re
import secrets
import shutil
import string
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import boto3
import yaml
from botocore.exceptions import ClientError
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener
from rich.console import Console
from rich.markup import escape
from rich.table import Table

from _prompts import choose, confirm

register_heif_opener()
console = Console()

MEDIA_BASE_URL = "https://media.sleepyblog.org"
MAX_PHOTO_EDGE_PX = 2560
# the gallery thumbnail; keep in sync with MEDIA_IMAGE_URL in MediaGallery.tsx
THUMBNAIL_EDGE_PX = 1024
JPEG_QUALITY = 85
# a file's name never changes once uploaded, so browsers can cache it forever
CACHE_CONTROL = "public, max-age=31536000, immutable"
ID_ALPHABET = string.ascii_letters + string.digits
ID_LENGTH = 8
PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"}
# uploaded untouched: re-encoding would break GIF animation and can't shrink video
PASSTHROUGH_EXTENSIONS = {".gif", ".mp4", ".mov", ".webm"}
EXIF_IFD = 0x8769
EXIF_DATE_TAKEN = 0x9003

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
# the `media:` line plus any indented or `- item` lines continuing it
MEDIA_FIELD = re.compile(r"^media:.*(?:\n[ \t-].*)*", re.MULTILINE)


# how many recent posts "another post" lists
RECENT_POST_COUNT = 10


@dataclass
class Target:
    """The post or project the media is being added to."""

    path: Path
    slug: str
    title: str
    kind: str  # "post" or "project"


@dataclass
class StagedFile:
    """A file from `_media_staging/` and the processed copy of it to upload."""

    original: Path
    upload: Path
    thumbnail: Path | None  # the 1024px copy, for photos only
    taken_at: str  # EXIF "YYYY:MM:DD HH:MM:SS", or "" when unknown


def get_project_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parent.parent


def parse_args() -> argparse.Namespace:
    """Parse the command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Upload _media_staging/ to R2 and add it to a post or project.",
    )
    target = parser.add_mutually_exclusive_group()
    target.add_argument(
        "post",
        nargs="?",
        help="post to add media to, as YYYY-MM-DD (asked for if not given)",
    )
    target.add_argument(
        "--project",
        "-p",
        help="/software project to add media to, by slug (e.g. sleepyconvert)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="process the photos and show what would happen, without uploading",
    )
    return parser.parse_args()


def load_target(path: Path, kind: str) -> Target:
    """Build a Target from a post or project file."""
    frontmatter = read_frontmatter(path)
    title = str(frontmatter.get("title" if kind == "post" else "name") or "")
    if title in ("", "TITLE"):
        title = path.stem
    return Target(
        path=path,
        slug=path.stem,
        title=title,
        kind=kind,
    )


def require_file(path: Path, kind: str) -> Path:
    """Return path, exiting with a message if it doesn't exist."""
    if not path.exists():
        console.print(f"[red]✗ No {kind} at {path}[/red]")
        sys.exit(1)
    return path


def ask_target(posts_dir: Path, projects_dir: Path) -> Target:
    """Ask whether the media goes to the newest post, another post, or a project.

    Args:
        posts_dir: The `_posts/` directory.
        projects_dir: The `_projects/` directory.

    Returns:
        The chosen post or project.
    """
    posts = sorted(posts_dir.glob("*.md"), reverse=True)
    projects = sorted(projects_dir.glob("*.md")) if projects_dir.is_dir() else []
    if not posts and not projects:
        console.print("[red]✗ No posts or projects yet. Create one first.[/red]")
        sys.exit(1)

    options = []
    if posts:
        newest = load_target(posts[0], "post")
        options.append(
            ("newest", f"The newest post: {newest.slug} ({escape(newest.title)})")
        )
        options.append(("post", "Another post"))
    if projects:
        options.append(("project", "A /software project"))
    where = choose("[bold]Where do these go?[/bold]", options)

    if where == "newest":
        return newest
    if where == "post":
        recent = [load_target(path, "post") for path in posts[:RECENT_POST_COUNT]]
        console.print()
        path = choose(
            "[bold]Which post?[/bold] (the latest few; pass a date for older ones)",
            [(post.path, f"{post.slug}  {escape(post.title)}") for post in recent],
        )
        return load_target(path, "post")
    options = [(path, path.stem) for path in projects]
    console.print()
    return load_target(choose("[bold]Which project?[/bold]", options), "project")


def read_frontmatter(post_path: Path) -> dict:
    """Parse a post's YAML frontmatter, exiting if the post doesn't have any."""
    match = FRONTMATTER.match(post_path.read_text(encoding="utf-8"))
    if not match:
        console.print(f"[red]✗ {post_path.name} has no --- frontmatter block.[/red]")
        sys.exit(1)
    return yaml.safe_load(match.group(1)) or {}


@dataclass
class Bucket:
    """An R2 bucket and an S3 client for it."""

    client: object
    name: str


R2_ENV_VARS = ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET")


def get_bucket() -> Bucket:
    """Connect to the R2 bucket named in the env vars, exiting if any aren't set."""
    missing = [name for name in R2_ENV_VARS if not os.getenv(name)]
    if missing:
        console.print(f"[red]✗ Set {', '.join(missing)} in your shell first.[/red]")
        sys.exit(1)

    client = boto3.client(
        "s3",
        endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )
    return Bucket(client=client, name=os.environ["R2_BUCKET"])


def collect_staged_files(staging_dir: Path) -> list[Path]:
    """Return the uploadable files in the staging directory.

    Deletes macOS `.DS_Store` files, ignores other hidden files and subdirectories
    (like `uploaded/`), and warns about file types that can't be uploaded.

    Args:
        staging_dir: The `_media_staging/` directory.

    Returns:
        The supported files, in no particular order.
    """
    files = []
    for path in staging_dir.iterdir():
        if path.name == ".DS_Store":
            path.unlink()
        elif path.is_file() and not path.name.startswith("."):
            extension = path.suffix.lower()
            if extension in PHOTO_EXTENSIONS | PASSTHROUGH_EXTENSIONS:
                files.append(path)
            else:
                console.print(
                    f"[yellow]⚠️  Skipping {path.name}: unsupported type[/yellow]"
                )
    return files


def prepare_file(original: Path, work_dir: Path) -> StagedFile:
    """Make the copy of a staged file that gets uploaded.

    Photos are rotated upright using their EXIF orientation, shrunk to fit
    MAX_PHOTO_EDGE_PX, and saved as JPEG with no metadata except the color profile,
    along with a THUMBNAIL_EDGE_PX copy. GIFs and videos are uploaded untouched.

    Args:
        original: The file in `_media_staging/`.
        work_dir: Temporary directory to write processed photos to.

    Returns:
        The original, the files to upload, and when the photo was taken.
    """
    if original.suffix.lower() in PASSTHROUGH_EXTENSIONS:
        return StagedFile(original=original, upload=original, thumbnail=None, taken_at="")

    with Image.open(original) as image:
        taken_at = str(image.getexif().get_ifd(EXIF_IFD).get(EXIF_DATE_TAKEN, ""))
        photo = ImageOps.exif_transpose(image).convert("RGB")
        icc_profile = image.info.get("icc_profile")
    copies = {}
    for name, edge in (("upload", MAX_PHOTO_EDGE_PX), ("thumbnail", THUMBNAIL_EDGE_PX)):
        copy = photo.copy()
        copy.thumbnail((edge, edge))
        copies[name] = work_dir / f"{original.name}.{name}.jpg"
        copy.save(
            copies[name],
            "JPEG",
            quality=JPEG_QUALITY,
            optimize=True,
            icc_profile=icc_profile,
        )
    return StagedFile(original=original, taken_at=taken_at, **copies)


def sort_by_date_taken(staged: list[StagedFile]) -> list[StagedFile]:
    """Order files by when they were taken; files with no date go last, by name."""
    return sorted(staged, key=lambda f: (f.taken_at == "", f.taken_at, f.original.name))


def print_plan(staged: list[StagedFile]) -> None:
    """Print the upload order and how much each photo was shrunk."""
    table = Table(header_style="bold")
    table.add_column("#", justify="right")
    table.add_column("File")
    table.add_column("Taken")
    table.add_column("Size", justify="right")

    for index, file in enumerate(staged, start=1):
        before = file.original.stat().st_size / 1_000_000
        after = file.upload.stat().st_size / 1_000_000
        size = (
            f"{after:.1f} MB"
            if file.upload == file.original
            else (f"{before:.1f} → {after:.1f} MB")
        )
        table.add_row(str(index), file.original.name, file.taken_at or "—", size)
    console.print(table)


def key_exists(bucket: Bucket, key: str) -> bool:
    """Return whether the bucket already has an object with this name."""
    try:
        bucket.client.head_object(Bucket=bucket.name, Key=key)
    except ClientError as error:
        if error.response["Error"]["Code"] in ("404", "NoSuchKey"):
            return False
        raise
    return True


def new_media_id(bucket: Bucket, extension: str) -> str:
    """Return a random file id that isn't in the bucket yet (as itself or a copy)."""
    while True:
        media_id = "".join(secrets.choice(ID_ALPHABET) for _ in range(ID_LENGTH))
        if not any(
            key_exists(bucket, f"{media_id}{suffix}{extension}") for suffix in ("", "h")
        ):
            return media_id


def put_object(bucket: Bucket, file: Path, key: str) -> None:
    """Upload one file to the bucket under the given name."""
    content_type = mimetypes.guess_type(key)[0] or "application/octet-stream"
    bucket.client.upload_file(
        str(file),
        bucket.name,
        key,
        ExtraArgs={"ContentType": content_type, "CacheControl": CACHE_CONTROL},
    )


def upload_file(bucket: Bucket, file: StagedFile) -> str:
    """Upload a staged file (and its thumbnail, for photos) to R2.

    Args:
        bucket: The R2 bucket.
        file: The processed file to upload.

    Returns:
        The file's public URL.
    """
    extension = file.upload.suffix.lower()
    media_id = new_media_id(bucket, extension)
    # thumbnail first, so the gallery never links a photo whose thumbnail is missing
    if file.thumbnail:
        put_object(bucket, file.thumbnail, f"{media_id}h{extension}")
    put_object(bucket, file.upload, f"{media_id}{extension}")
    return f"{MEDIA_BASE_URL}/{media_id}{extension}"


def append_post_media(post_path: Path, links: list[str]) -> None:
    """Add links to the end of a post's or project's `media:` list, as one line.

    Only the `media:` field is rewritten; the rest of the post is left as it was. If
    the frontmatter has no `media:` field, one is added at the end of it.

    Args:
        post_path: The post to update.
        links: The media URLs to append.
    """
    text = post_path.read_text(encoding="utf-8")
    frontmatter = FRONTMATTER.match(text)
    existing = read_frontmatter(post_path).get("media") or []
    media_line = f"media: {[*existing, *links]}"

    block = frontmatter.group(1)
    if MEDIA_FIELD.search(block):
        new_block = MEDIA_FIELD.sub(lambda _: media_line, block, count=1)
    else:
        new_block = f"{block}\n{media_line}"
    post_path.write_text(
        text.replace(block, new_block, 1),
        encoding="utf-8",
    )


def archive_originals(files: list[Path], archive_dir: Path) -> None:
    """Move uploaded originals out of the staging directory, never overwriting."""
    archive_dir.mkdir(parents=True, exist_ok=True)
    for file in files:
        destination = archive_dir / file.name
        counter = 1
        while destination.exists():
            destination = archive_dir / f"{file.stem}_{counter}{file.suffix}"
            counter += 1
        shutil.move(file, destination)


def main() -> None:
    """Process, upload, and attach the staged media to a post."""
    args = parse_args()
    project_root = get_project_root()
    staging_dir = project_root / "_media_staging"
    staging_dir.mkdir(exist_ok=True)

    files = collect_staged_files(staging_dir)
    if not files:
        console.print("[yellow]Nothing to upload: _media_staging/ is empty.[/yellow]")
        return

    posts_dir = project_root / "_posts"
    projects_dir = project_root / "_projects"
    if args.project:
        path = require_file(projects_dir / f"{args.project}.md", "project")
        target = load_target(path, "project")
    elif args.post:
        target = load_target(
            require_file(posts_dir / f"{args.post}.md", "post"), "post"
        )
    else:
        target = ask_target(posts_dir, projects_dir)
    relative_path = target.path.relative_to(project_root)
    bucket = None if args.dry_run else get_bucket()

    console.print(
        f"\n📸 {len(files)} file(s) for [bold]{relative_path}[/bold] "
        f"({escape(target.title)})\n"
    )

    with tempfile.TemporaryDirectory() as work_dir:
        with console.status("Processing photos..."):
            staged = sort_by_date_taken(
                [prepare_file(file, Path(work_dir)) for file in files]
            )
        print_plan(staged)

        if args.dry_run:
            console.print("\n[dim]Dry run: nothing was uploaded or changed.[/dim]")
            return
        if not confirm(f"\nUpload these and add them to the {target.kind}?", True):
            console.print("[dim]Cancelled.[/dim]")
            return

        uploaded: list[tuple[StagedFile, str]] = []
        failed = False
        try:
            for index, file in enumerate(staged, start=1):
                console.print(
                    f"⬆️  Uploading {file.original.name} ({index}/{len(staged)})"
                )
                uploaded.append((file, upload_file(bucket, file)))
        except (Exception, KeyboardInterrupt) as error:
            # still record whatever finished, so a re-run doesn't upload it twice
            console.print(f"[red]✗ Upload stopped: {error or 'cancelled'}[/red]")
            failed = True

    if not uploaded:
        sys.exit(1)

    append_post_media(target.path, [url for _, url in uploaded])
    archive_dir = staging_dir / "uploaded" / target.slug
    archive_originals([file.original for file, _ in uploaded], archive_dir)

    console.print(
        f"[green]✅ Added {len(uploaded)} link(s) to {relative_path}. "
        f"Originals moved to {archive_dir.relative_to(project_root)}/[/green]"
    )
    if failed:
        console.print(
            "[yellow]Re-run to upload what's left in _media_staging/.[/yellow]"
        )
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[dim]👋 Cancelled.[/dim]")
        sys.exit(130)
