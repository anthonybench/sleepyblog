#!/usr/bin/env python
"""Sort the photos in `_media_staging/` into the /furniture gallery, one at a time, in a browser.

A one-off helper for the gallery's first big batch. For each photo it asks:
    - Keep or delete? Deleting removes the file for good, so stage copies only.
    - Its new name. It's saved as `<name>.jpg`; CR2, HEIC, and PNG are converted.
    - Its category, an optional caption, and whether it's featured.

Each kept photo is renamed, then uploaded in the background with add_media.py's
pipeline (rotated, metadata stripped, 2560px + 1024px copies on R2), appended to
`_furniture/gallery.yml`, and moved to `_media_staging/uploaded/furniture/`. Skipped
photos stay where they are. Subdirectories like `uploaded/` are ignored.

Ctrl+C in the terminal stops it once the queued uploads finish.

Needs the R2 env vars (see add_media.py) and macOS `sips` for CR2 files.

Usage:
    ./_tools/sort_furniture.py              # opens http://localhost:8765
    ./_tools/sort_furniture.py --dry-run    # renames and deletes, but skips the upload and gallery.yml
"""

import sys

sys.dont_write_bytecode = True  # _tools/__pycache__ is tracked in git

import argparse  # noqa: E402
import json  # noqa: E402
import queue  # noqa: E402
import re  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402
import threading  # noqa: E402
import traceback  # noqa: E402
import webbrowser  # noqa: E402
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer  # noqa: E402
from pathlib import Path  # noqa: E402
from urllib.parse import unquote  # noqa: E402

from PIL import Image, ImageOps  # noqa: E402

from add_media import (  # noqa: E402
    EXIF_DATE_TAKEN,
    EXIF_IFD,
    FURNITURE_CATEGORIES,
    FURNITURE_GALLERY,
    PHOTO_EXTENSIONS,
    FurnitureDetails,
    append_furniture_photos,
    archive_originals,
    get_bucket,
    get_project_root,
    prepare_file,
    upload_file,
)

PORT = 8765
PREVIEW_EDGE_PX = 1600
RAW_EXTENSIONS = {".cr2"}  # converted with macOS sips; Pillow can't read them
JPEG_EXTENSIONS = {".jpg", ".jpeg"}
NAME_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 _.-]*$")

PROJECT_ROOT = get_project_root()
STAGING_DIR = PROJECT_ROOT / "_media_staging"
ARCHIVE_DIR = STAGING_DIR / "uploaded" / "furniture"
GALLERY_PATH = PROJECT_ROOT / FURNITURE_GALLERY
WORK_DIR = Path(tempfile.mkdtemp(prefix="sort_furniture_"))

jobs: "queue.Queue[dict]" = queue.Queue()
job_log: list[dict] = []  # every kept photo and its upload state, in order
job_lock = threading.Lock()


def staged_photos() -> list[dict]:
    """Return the photos at the top level of `_media_staging/`, oldest first."""
    photos = []
    for path in STAGING_DIR.iterdir():
        extension = path.suffix.lower()
        if not path.is_file() or path.name.startswith("."):
            continue
        if extension not in PHOTO_EXTENSIONS | RAW_EXTENSIONS:
            continue
        taken = ""
        if extension not in RAW_EXTENSIONS:
            try:
                with Image.open(path) as image:
                    taken = str(image.getexif().get_ifd(EXIF_IFD).get(EXIF_DATE_TAKEN, ""))
            except Exception:
                pass
        photos.append({"name": path.name, "taken": taken})
    return sorted(photos, key=lambda p: (p["taken"] == "", p["taken"], p["name"]))


def raw_to_jpeg(source: Path, destination: Path) -> None:
    """Convert a camera raw file to a full-size JPEG with macOS sips."""
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "95",
         str(source), "--out", str(destination)],
        check=True,
        capture_output=True,
    )


def preview(name: str) -> Path:
    """Return a cached, upright, PREVIEW_EDGE_PX copy of a staged photo for the browser."""
    cached = WORK_DIR / "previews" / f"{name}.jpg"
    if cached.exists():
        return cached
    cached.parent.mkdir(exist_ok=True)
    source = STAGING_DIR / name
    if source.suffix.lower() in RAW_EXTENSIONS:
        converted = WORK_DIR / f"{name}.raw.jpg"
        raw_to_jpeg(source, converted)
        source = converted
    with Image.open(source) as image:
        image.draft("RGB", (PREVIEW_EDGE_PX, PREVIEW_EDGE_PX))  # fast JPEG decode
        photo = ImageOps.exif_transpose(image).convert("RGB")
    photo.thumbnail((PREVIEW_EDGE_PX, PREVIEW_EDGE_PX))
    photo.save(cached, "JPEG", quality=80)
    return cached


def name_taken(new_name: str) -> bool:
    """Return whether `<new_name>.jpg` already exists in staging or the archive."""
    file_name = f"{new_name}.jpg".lower()
    return any(
        directory.is_dir()
        and any(p.name.lower() == file_name for p in directory.iterdir())
        for directory in (STAGING_DIR, ARCHIVE_DIR)
    )


def rename_to_jpeg(name: str, new_name: str) -> Path:
    """Rename a staged photo to `<new_name>.jpg`, converting it if it isn't a JPEG."""
    source = STAGING_DIR / name
    destination = STAGING_DIR / f"{new_name}.jpg"
    extension = source.suffix.lower()
    if extension in JPEG_EXTENSIONS:
        source.rename(destination)
        return destination
    if extension in RAW_EXTENSIONS:
        raw_to_jpeg(source, destination)
    else:  # HEIC, PNG, WebP: keep the EXIF so add_media can still rotate it
        with Image.open(source) as image:
            exif = image.info.get("exif", b"")
            icc_profile = image.info.get("icc_profile")
            image.convert("RGB").save(
                destination, "JPEG", quality=95, exif=exif, icc_profile=icc_profile
            )
    source.unlink()
    return destination


def upload_worker(dry_run: bool) -> None:
    """Upload queued photos one at a time, so gallery.yml keeps the order they were sorted in."""
    bucket = None if dry_run else get_bucket()
    while True:
        job = jobs.get()
        try:
            job["state"] = "uploading"
            staged = prepare_file(job["path"], WORK_DIR)
            details = FurnitureDetails(job["category"], job["caption"], job["featured"])
            if not dry_run:
                url = upload_file(bucket, staged)
                append_furniture_photos(GALLERY_PATH, [(staged, url, details)])
            archive_originals([job["path"]], ARCHIVE_DIR)
            job["state"] = "done"
        except Exception as error:
            traceback.print_exc()
            job["state"] = "failed"
            job["error"] = f"{type(error).__name__}: {error}"
        finally:
            with job_lock:
                del job["path"]  # not JSON; the file has moved anyway
            jobs.task_done()


def jobs_json() -> list[dict]:
    """The upload log without the (non-JSON) paths."""
    with job_lock:
        return [{k: v for k, v in job.items() if k != "path"} for job in job_log]


class Handler(BaseHTTPRequestHandler):
    """The page, the photo previews, and the keep/delete actions."""

    def log_message(self, format: str, *args) -> None:  # noqa: A002
        pass  # keep the terminal for upload errors

    def send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, data: object, status: int = 200) -> None:
        self.send(status, json.dumps(data).encode(), "application/json")

    def staged_file(self, name: str) -> Path | None:
        """Return the staged file with this name, refusing anything outside staging."""
        path = STAGING_DIR / name
        if "/" in name or name.startswith(".") or not path.is_file():
            return None
        return path

    def do_GET(self) -> None:
        if self.path == "/":
            self.send(200, PAGE.encode(), "text/html; charset=utf-8")
        elif self.path == "/api/photos":
            self.send_json({"photos": staged_photos(), "categories": FURNITURE_CATEGORIES})
        elif self.path == "/api/jobs":
            self.send_json(jobs_json())
        elif self.path.startswith("/preview/"):
            name = unquote(self.path.removeprefix("/preview/"))
            if not self.staged_file(name):
                self.send_json({"error": "not found"}, 404)
                return
            try:
                self.send(200, preview(name).read_bytes(), "image/jpeg")
            except Exception as error:
                self.send_json({"error": str(error)}, 500)
        else:
            self.send_json({"error": "not found"}, 404)

    def do_POST(self) -> None:
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")
        path = self.staged_file(str(body.get("name", "")))
        if not path:
            self.send_json({"error": "That photo isn't in _media_staging/ anymore."}, 404)
        elif self.path == "/api/delete":
            path.unlink()
            self.send_json({"ok": True})
        elif self.path == "/api/keep":
            self.keep(path, body)
        else:
            self.send_json({"error": "not found"}, 404)

    def keep(self, path: Path, body: dict) -> None:
        new_name = str(body.get("newName", "")).strip()
        new_name = re.sub(r"\.(jpe?g|cr2|heic|heif|png|webp)$", "", new_name, flags=re.I)
        category = body.get("category")
        if not NAME_PATTERN.match(new_name):
            error = "Use letters, numbers, spaces, dashes, dots, or underscores for the name."
        elif category not in FURNITURE_CATEGORIES:
            error = "Pick a category."
        elif f"{new_name}.jpg".lower() != path.name.lower() and name_taken(new_name):
            error = f"{new_name}.jpg already exists. Pick another name."
        else:
            error = None
        if error:
            self.send_json({"error": error}, 400)
            return

        try:
            renamed = rename_to_jpeg(path.name, new_name)
        except Exception as error:
            self.send_json({"error": f"Couldn't rename it: {error}"}, 500)
            return
        job = {
            "name": path.name,
            "newName": renamed.name,
            "category": category,
            "caption": str(body.get("caption", "")).strip(),
            "featured": bool(body.get("featured")),
            "state": "queued",
            "path": renamed,
        }
        with job_lock:
            job_log.append(job)
        jobs.put(job)
        self.send_json({"ok": True, "newName": renamed.name})


PAGE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sort Furniture</title>
<style>
  :root { --bg:#16181c; --panel:#1f2228; --line:#2e323a; --text:#e6e6e6; --dim:#9aa0aa;
          --accent:#d9a25f; --danger:#e0605a; --ok:#6cc58a; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.4 system-ui,sans-serif;
         height:100vh; display:grid; grid-template-columns:1fr 360px; grid-template-rows:1fr auto; }
  #stage { display:flex; align-items:center; justify-content:center; padding:16px; min-height:0; }
  #stage img { max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; }
  #stage .msg { color:var(--dim); font-size:18px; text-align:center; }
  aside { background:var(--panel); border-left:1px solid var(--line); padding:20px;
          display:flex; flex-direction:column; gap:16px; overflow:auto; }
  .meta { color:var(--dim); font-size:13px; word-break:break-all; }
  .meta b { color:var(--text); font-size:15px; }
  label { display:block; font-size:13px; color:var(--dim); margin-bottom:6px; }
  input[type=text] { width:100%; padding:9px 10px; border-radius:6px; border:1px solid var(--line);
                     background:var(--bg); color:var(--text); font:inherit; }
  input[type=text]:focus { outline:2px solid var(--accent); border-color:transparent; }
  .suffix { display:flex; align-items:center; gap:6px; }
  .suffix span { color:var(--dim); }
  .cats { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .cats label { margin:0; padding:8px 10px; border:1px solid var(--line); border-radius:6px;
                color:var(--text); font-size:14px; cursor:pointer; display:flex; gap:8px; align-items:center; }
  .cats label:has(input:checked) { border-color:var(--accent); background:#d9a25f22; }
  .cats kbd { margin-left:auto; color:var(--dim); font-size:11px; }
  .check { display:flex; gap:8px; align-items:center; color:var(--text); font-size:14px; cursor:pointer; margin:0; }
  .buttons { display:grid; grid-template-columns:2fr 1fr 1fr; gap:8px; margin-top:auto; }
  button { padding:10px; border-radius:6px; border:1px solid var(--line); background:var(--bg);
           color:var(--text); font:inherit; cursor:pointer; }
  button:hover { border-color:var(--dim); }
  button.keep { background:var(--accent); color:#1a1a1a; border:none; font-weight:600; }
  button.delete { color:var(--danger); }
  button.delete.armed { background:var(--danger); color:#1a1a1a; border-color:var(--danger); }
  button:disabled { opacity:.5; cursor:default; }
  .error { color:var(--danger); font-size:13px; min-height:1em; }
  .hint { color:var(--dim); font-size:12px; }
  footer { grid-column:1 / -1; border-top:1px solid var(--line); padding:8px 16px; font-size:13px;
           color:var(--dim); display:flex; gap:16px; flex-wrap:wrap; }
  footer .failed { color:var(--danger); }
  footer .done { color:var(--ok); }
  @media (max-width:800px) { body { grid-template-columns:1fr; grid-template-rows:50vh auto auto; height:auto; }
                             aside { border-left:none; border-top:1px solid var(--line); } }
</style>
</head>
<body>
<main id="stage"><div class="msg">Loading…</div></main>
<aside>
  <div class="meta"><b id="progress"></b><br><span id="file"></span><br><span id="taken"></span></div>
  <form id="form" autocomplete="off">
    <div style="margin-bottom:16px">
      <label for="newName">Name</label>
      <div class="suffix"><input type="text" id="newName" required><span>.jpg</span></div>
    </div>
    <div style="margin-bottom:16px">
      <label>Category <span class="hint">(Alt+1–6)</span></label>
      <div class="cats" id="cats"></div>
    </div>
    <div style="margin-bottom:16px">
      <label for="caption">Caption <span class="hint">(optional)</span></label>
      <input type="text" id="caption">
    </div>
    <label class="check"><input type="checkbox" id="featured"> Featured (full width at the top) <span class="hint">Alt+F</span></label>
  </form>
  <div class="error" id="error"></div>
  <div class="buttons">
    <button class="keep" id="keep" title="Enter">Keep &amp; upload ⏎</button>
    <button id="skip" title="Leave it in _media_staging/">Skip</button>
    <button class="delete" id="delete" title="Deletes the file">Delete</button>
  </div>
  <div class="hint">Enter keeps. Skip leaves the photo in <code>_media_staging/</code> for later. Delete (click twice) removes the file for good.</div>
</aside>
<footer id="jobs"></footer>
<script>
let photos = [], categories = [], index = 0, lastName = "", busy = false;
const $ = (id) => document.getElementById(id);

// "walnut-table-2" -> "walnut-table-3"; "walnut-table" -> "walnut-table-2"
function nextName(name) {
  if (!name) return "";
  const m = name.match(/^(.*?)(\d+)$/);
  return m ? m[1] + (Number(m[2]) + 1) : name + "-2";
}

function previewUrl(name) { return "/preview/" + encodeURIComponent(name); }

function show() {
  $("error").textContent = "";
  disarmDelete();
  if (index >= photos.length) {
    $("stage").innerHTML = '<div class="msg">All sorted. Uploads finish in the background (see below).<br>' +
      'Ctrl+C in the terminal once they\'re done.</div>';
    $("progress").textContent = "Done";
    $("file").textContent = $("taken").textContent = "";
    for (const b of ["keep", "skip", "delete"]) $(b).disabled = true;
    return;
  }
  const photo = photos[index];
  $("progress").textContent = `Photo ${index + 1} of ${photos.length}`;
  $("file").textContent = photo.name;
  $("taken").textContent = photo.taken ? "Taken " + photo.taken : "";
  const img = new Image();
  img.alt = photo.name;
  img.onerror = () => { $("stage").innerHTML = '<div class="msg">Couldn\'t load a preview of this one.</div>'; };
  img.src = previewUrl(photo.name);
  $("stage").replaceChildren(img);
  // warm the next preview so it's ready when this one's done
  if (photos[index + 1]) new Image().src = previewUrl(photos[index + 1].name);
  $("newName").value = nextName(lastName);
  $("caption").value = "";
  $("featured").checked = false;
  $("newName").focus();
  $("newName").select();
}

async function post(url, data) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

async function act(fn) {
  if (busy || index >= photos.length) return;
  busy = true;
  try { await fn(photos[index]); index++; show(); }
  catch (e) { $("error").textContent = e.message; }
  finally { busy = false; refreshJobs(); }
}

const keep = () => act(async (photo) => {
  const checked = document.querySelector("input[name=category]:checked");
  if (!checked) throw new Error("Pick a category.");
  const newName = $("newName").value.trim();
  await post("/api/keep", { name: photo.name, newName, category: checked.value,
                            caption: $("caption").value, featured: $("featured").checked });
  lastName = newName.replace(/\.jpe?g$/i, "");
});
const remove = () => act((photo) => post("/api/delete", { name: photo.name }));
const skip = () => act(async () => {});

$("keep").onclick = keep;
// two clicks instead of confirm(): browsers let you turn confirm() off, which would make it always "no"
let deleteArmed = null;
function disarmDelete() { clearTimeout(deleteArmed); deleteArmed = null; $("delete").textContent = "Delete"; $("delete").classList.remove("armed"); }
$("delete").onclick = () => {
  if (deleteArmed) { disarmDelete(); remove(); return; }
  $("delete").textContent = "Sure? Click again";
  $("delete").classList.add("armed");
  deleteArmed = setTimeout(disarmDelete, 3000);
};
$("skip").onclick = skip;
$("form").onsubmit = (e) => { e.preventDefault(); keep(); };
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); keep(); }
  else if (e.altKey && /^Digit[1-9]$/.test(e.code)) {
    const box = document.querySelectorAll("input[name=category]")[Number(e.code.slice(5)) - 1];
    if (box) { box.checked = true; e.preventDefault(); }
  } else if (e.altKey && e.code === "KeyF") { $("featured").checked = !$("featured").checked; e.preventDefault(); }
});

async function refreshJobs() {
  const jobs = await (await fetch("/api/jobs")).json();
  const count = (state) => jobs.filter((j) => j.state === state).length;
  const pending = count("queued") + count("uploading");
  const parts = [`<span class="done">${count("done")} uploaded</span>`];
  if (pending) parts.push(`${pending} uploading…`);
  for (const j of jobs.filter((j) => j.state === "failed"))
    parts.push(`<span class="failed">✗ ${j.newName}: ${j.error} (it's still in _media_staging/; re-run to retry)</span>`);
  $("jobs").innerHTML = parts.join("");
}
setInterval(refreshJobs, 1500);

(async () => {
  const data = await (await fetch("/api/photos")).json();
  photos = data.photos; categories = data.categories;
  $("cats").innerHTML = categories.map((c, i) =>
    `<label><input type="radio" name="category" value="${c}"${i === 0 ? " checked" : ""}> ${c}<kbd>${i + 1}</kbd></label>`).join("");
  show();
  refreshJobs();
})();
</script>
</body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true",
                        help="rename and delete, but don't upload or touch gallery.yml")
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()

    if not args.dry_run:
        get_bucket()  # exits now, not mid-sort, if the R2 env vars aren't set
    threading.Thread(target=upload_worker, args=(args.dry_run,), daemon=True).start()

    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    url = f"http://localhost:{args.port}"
    count = len(staged_photos())
    print(f"Sorting {count} photos at {url}{' (dry run)' if args.dry_run else ''}. Ctrl+C to stop.")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
    pending = jobs.unfinished_tasks
    if pending:
        print(f"\nFinishing {pending} upload(s)… (Ctrl+C again to abandon them)")
        jobs.join()
    done = sum(job["state"] == "done" for job in job_log)
    failed = [job for job in job_log if job["state"] == "failed"]
    print(f"\n{done} photo(s) {'processed' if args.dry_run else 'added to ' + str(FURNITURE_GALLERY)}.")
    for job in failed:
        print(f"  ✗ {job['newName']}: {job['error']} (still in _media_staging/)")


if __name__ == "__main__":
    main()
