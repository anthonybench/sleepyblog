#!/usr/bin/env python
"""Review the /furniture gallery one photo at a time in a browser, and revise each entry.

Walks through `_furniture/gallery.yml` in order and lets you change each photo's
category, caption, and featured flag. Saving rewrites the gallery file, kept sorted by
category (in the tab order from add_media.py's FURNITURE_CATEGORIES; within a category,
photos keep their order). The photos themselves on R2 are never touched.

Each photo has a link to its tab on the Vercel preview, so you can check how it looks
once you've pushed. Your place is kept in the page URL (#12), so reloading is safe.

Usage:
    ./_tools/organize_furniture.py            # opens http://localhost:8766
    ./_tools/organize_furniture.py --sort     # just sort gallery.yml by category and exit
"""

import sys

sys.dont_write_bytecode = True  # _tools/__pycache__ is tracked in git

import argparse  # noqa: E402
import json  # noqa: E402
import re  # noqa: E402
import threading  # noqa: E402
import webbrowser  # noqa: E402
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer  # noqa: E402

import yaml  # noqa: E402

from add_media import FURNITURE_CATEGORIES, FURNITURE_GALLERY, get_project_root  # noqa: E402

PORT = 8766
PREVIEW_URL = "https://sleepyblog-git-feature-furniture-anthonybenchs-projects.vercel.app"
GALLERY_PATH = get_project_root() / FURNITURE_GALLERY
PHOTOS_START = re.compile(r"^photos:", re.MULTILINE)
FIELDS = ("url", "width", "height", "category", "caption", "featured")

gallery_lock = threading.Lock()  # one save at a time


def read_photos() -> list[dict]:
    """Return the gallery's photo entries, in file order."""
    return yaml.safe_load(GALLERY_PATH.read_text(encoding="utf-8")).get("photos") or []


def sort_by_category(photos: list[dict]) -> list[dict]:
    """Group photos by category in tab order; within a category, file order is kept."""
    order = {category: index for index, category in enumerate(FURNITURE_CATEGORIES)}
    return sorted(photos, key=lambda photo: order.get(photo["category"], len(order)))


def write_photos(photos: list[dict]) -> None:
    """Rewrite the gallery's `photos:` list, keeping the comment header above it.

    Entries are written in the same layout add_media.py appends: optional fields are
    left out when empty, and captions are double-quoted.
    """
    text = GALLERY_PATH.read_text(encoding="utf-8")
    header = text[: PHOTOS_START.search(text).start()]
    lines = ["photos:"]
    for photo in photos:
        lines += [
            f"  - url: {photo['url']}",
            f"    width: {photo['width']}",
            f"    height: {photo['height']}",
            f"    category: {photo['category']}",
        ]
        if photo.get("caption"):
            # a JSON string is a valid YAML double-quoted string
            lines.append(f"    caption: {json.dumps(photo['caption'], ensure_ascii=False)}")
        if photo.get("featured"):
            lines.append("    featured: true")
    new_text = header + "\n".join(lines) + "\n"

    written = yaml.safe_load(new_text)["photos"]
    expected = [{k: p[k] for k in FIELDS if p.get(k)} for p in photos]
    if [{k: v for k, v in p.items() if v} for p in written] != expected:
        raise RuntimeError("gallery.yml didn't round-trip; nothing was written")
    GALLERY_PATH.write_text(new_text, encoding="utf-8")


class Handler(BaseHTTPRequestHandler):
    """The page, the gallery entries, and saving one entry."""

    def log_message(self, format: str, *args) -> None:  # noqa: A002
        pass

    def send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, data: object, status: int = 200) -> None:
        self.send(status, json.dumps(data).encode(), "application/json")

    def do_GET(self) -> None:
        if self.path == "/":
            self.send(200, PAGE.encode(), "text/html; charset=utf-8")
        elif self.path == "/api/photos":
            self.send_json(
                {
                    "photos": read_photos(),
                    "categories": FURNITURE_CATEGORIES,
                    "previewUrl": PREVIEW_URL,
                }
            )
        else:
            self.send_json({"error": "not found"}, 404)

    def do_POST(self) -> None:
        if self.path != "/api/save":
            self.send_json({"error": "not found"}, 404)
            return
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        if body.get("category") not in FURNITURE_CATEGORIES:
            self.send_json({"error": "Pick a category."}, 400)
            return
        with gallery_lock:
            photos = read_photos()
            photo = next((p for p in photos if p["url"] == body.get("url")), None)
            if not photo:
                self.send_json({"error": "That photo isn't in gallery.yml anymore."}, 404)
                return
            photo["category"] = body["category"]
            photo["caption"] = str(body.get("caption", "")).strip()
            photo["featured"] = bool(body.get("featured"))
            photos = sort_by_category(photos)
            try:
                write_photos(photos)
            except Exception as error:
                self.send_json({"error": str(error)}, 500)
                return
        self.send_json({"photos": photos})


PAGE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Organize Furniture</title>
<style>
  :root { --bg:#16181c; --panel:#1f2228; --line:#2e323a; --text:#e6e6e6; --dim:#9aa0aa;
          --accent:#d9a25f; --danger:#e0605a; --ok:#6cc58a; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.4 system-ui,sans-serif;
         height:100vh; display:grid; grid-template-columns:1fr 380px; grid-template-rows:auto 1fr; }
  nav { grid-column:1 / -1; display:flex; gap:6px; flex-wrap:wrap; padding:10px 16px;
        border-bottom:1px solid var(--line); }
  nav button { font-size:13px; padding:6px 10px; }
  nav button.current { border-color:var(--accent); color:var(--accent); }
  #stage { position:relative; display:flex; align-items:center; justify-content:center; padding:16px; min-height:0; }
  #stage img { max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; }
  .arrow { position:absolute; top:50%; transform:translateY(-50%); font-size:22px; padding:14px 12px;
           background:#16181ccc; }
  .arrow.prev { left:16px; } .arrow.next { right:16px; }
  aside { background:var(--panel); border-left:1px solid var(--line); padding:20px;
          display:flex; flex-direction:column; gap:16px; overflow:auto; }
  .meta { color:var(--dim); font-size:13px; word-break:break-all; }
  .meta b { color:var(--text); font-size:15px; }
  .meta a { color:var(--accent); }
  label { display:block; font-size:13px; color:var(--dim); margin-bottom:6px; }
  textarea { width:100%; min-height:90px; padding:9px 10px; border-radius:6px; border:1px solid var(--line);
             background:var(--bg); color:var(--text); font:inherit; resize:vertical; }
  textarea:focus { outline:2px solid var(--accent); border-color:transparent; }
  .cats { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .cats label { margin:0; padding:8px 10px; border:1px solid var(--line); border-radius:6px;
                color:var(--text); font-size:14px; cursor:pointer; display:flex; gap:8px; align-items:center; }
  .cats label:has(input:checked) { border-color:var(--accent); background:#d9a25f22; }
  .cats kbd { margin-left:auto; color:var(--dim); font-size:11px; }
  .check { display:flex; gap:8px; align-items:center; color:var(--text); font-size:14px; cursor:pointer; margin:0; }
  .buttons { display:grid; grid-template-columns:1fr 2fr; gap:8px; margin-top:auto; }
  button { padding:10px; border-radius:6px; border:1px solid var(--line); background:var(--bg);
           color:var(--text); font:inherit; cursor:pointer; }
  button:hover { border-color:var(--dim); }
  button.save { background:var(--accent); color:#1a1a1a; border:none; font-weight:600; }
  button:disabled { opacity:.5; cursor:default; }
  .status { font-size:13px; min-height:1em; }
  .status.error { color:var(--danger); } .status.ok { color:var(--ok); } .status.dirty { color:var(--accent); }
  .hint { color:var(--dim); font-size:12px; }
  @media (max-width:800px) { body { grid-template-columns:1fr; grid-template-rows:auto 50vh auto; height:auto; }
                             aside { border-left:none; border-top:1px solid var(--line); } }
</style>
</head>
<body>
<nav id="jump"></nav>
<main id="stage"></main>
<aside>
  <div class="meta">
    <b id="progress"></b><br>
    <span id="dims"></span><br>
    <a id="full" target="_blank" rel="noopener">full-size photo ↗</a> ·
    <a id="preview" target="_blank" rel="noopener">its tab on the preview ↗</a>
  </div>
  <div>
    <label>Category <span class="hint">(Alt+1–6)</span></label>
    <div class="cats" id="cats"></div>
  </div>
  <div>
    <label for="caption">Caption <span class="hint">(optional; also the alt text)</span></label>
    <textarea id="caption"></textarea>
  </div>
  <label class="check"><input type="checkbox" id="featured"> Featured (full width at the top) <span class="hint">Alt+F</span></label>
  <div class="status" id="status"></div>
  <div class="buttons">
    <button id="back" title="Alt+←">← Back</button>
    <button class="save" id="save" title="Ctrl/⌘+Enter">Save &amp; next →</button>
  </div>
  <div class="hint">Ctrl/⌘+Enter saves and moves on (just moves on if nothing changed). Alt+←/→ moves without saving.
    Changing a category moves the photo into that category's group in gallery.yml.</div>
</aside>
<script>
let photos = [], categories = [], previewUrl = "", index = 0, busy = false;
const $ = (id) => document.getElementById(id);
const thumb = (url) => url.replace(/(\.[a-z]+)$/i, "h$1");

function form() {
  return { category: document.querySelector("input[name=category]:checked").value,
           caption: $("caption").value.trim(), featured: $("featured").checked };
}
function isDirty() {
  const p = photos[index], f = form();
  return f.category !== p.category || f.caption !== (p.caption || "") || f.featured !== Boolean(p.featured);
}
function setStatus(text, kind) { $("status").textContent = text; $("status").className = "status " + (kind || ""); }

function renderJump() {
  $("jump").innerHTML = "";
  for (const c of categories) {
    const first = photos.findIndex((p) => p.category === c);
    const count = photos.filter((p) => p.category === c).length;
    const featured = photos.filter((p) => p.category === c && p.featured).length;
    const b = document.createElement("button");
    b.textContent = `${c} (${count}${featured ? `, ★${featured}` : ""})`;
    b.disabled = first < 0;
    if (photos[index] && photos[index].category === c) b.className = "current";
    b.onclick = () => go(first);
    $("jump").appendChild(b);
  }
}

function show() {
  const p = photos[index];
  history.replaceState(null, "", "#" + (index + 1));
  const inCat = photos.filter((q) => q.category === p.category);
  $("progress").textContent = `Photo ${index + 1} of ${photos.length} · ${p.category} ${inCat.indexOf(p) + 1}/${inCat.length}`;
  $("dims").textContent = `${p.width} × ${p.height}${p.width > p.height ? " (landscape)" : p.width < p.height ? " (portrait)" : ""}`;
  $("full").href = p.url;
  $("preview").href = `${previewUrl}/furniture#${p.category}`;
  // thumbnail first (fast), then swap in the full-size photo once it's loaded
  const img = new Image();
  img.src = thumb(p.url);
  const full = new Image();
  full.onload = () => { if (photos[index] === p) img.src = p.url; };
  full.src = p.url;
  $("stage").replaceChildren(img, arrow("prev", "‹", -1), arrow("next", "›", 1));
  if (photos[index + 1]) new Image().src = thumb(photos[index + 1].url);
  document.querySelector(`input[name=category][value="${p.category}"]`).checked = true;
  $("caption").value = p.caption || "";
  $("featured").checked = Boolean(p.featured);
  $("back").disabled = index === 0;
  renderJump();
}
function arrow(cls, text, step) {
  const b = document.createElement("button");
  b.className = "arrow " + cls; b.textContent = text; b.disabled = !photos[index + step];
  b.onclick = () => go(index + step);
  return b;
}

function go(i) {
  if (i < 0 || i >= photos.length || busy) return;
  if (isDirty() && !window.__confirmLeave) {
    setStatus("Unsaved changes: save them, or press the same key again to discard.", "dirty");
    window.__confirmLeave = true;
    return;
  }
  window.__confirmLeave = false;
  index = i; setStatus(""); show();
}

async function saveAndNext() {
  if (busy) return;
  window.__confirmLeave = false;
  if (!isDirty()) {
    if (index + 1 < photos.length) go(index + 1); else setStatus("That's the last one. All done!", "ok");
    return;
  }
  busy = true;
  const p = photos[index];
  const nextUrl = photos[index + 1] && photos[index + 1].url;
  try {
    const res = await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" },
                                           body: JSON.stringify({ url: p.url, ...form() }) });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || res.statusText);
    photos = body.photos;
    // a changed category moves the photo, so continue from whatever came after it
    const next = nextUrl ? photos.findIndex((q) => q.url === nextUrl) : -1;
    index = next >= 0 ? next : Math.min(index, photos.length - 1);
    show();
    setStatus("Saved.", "ok");
  } catch (e) { setStatus(e.message, "error"); }
  finally { busy = false; }
}

$("save").onclick = saveAndNext;
$("back").onclick = () => go(index - 1);
$("caption").addEventListener("input", () => { window.__confirmLeave = false; });
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveAndNext(); }
  else if (e.altKey && e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  else if (e.altKey && e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  else if (e.altKey && /^Digit[1-9]$/.test(e.code)) {
    const box = document.querySelectorAll("input[name=category]")[Number(e.code.slice(5)) - 1];
    if (box) { box.checked = true; e.preventDefault(); }
  } else if (e.altKey && e.code === "KeyF") { $("featured").checked = !$("featured").checked; e.preventDefault(); }
});
window.addEventListener("beforeunload", (e) => { if (photos[index] && isDirty()) e.preventDefault(); });

(async () => {
  const data = await (await fetch("/api/photos")).json();
  photos = data.photos; categories = data.categories; previewUrl = data.previewUrl;
  $("cats").innerHTML = categories.map((c, i) =>
    `<label><input type="radio" name="category" value="${c}"> ${c}<kbd>${i + 1}</kbd></label>`).join("");
  if (!photos.length) { $("stage").textContent = "gallery.yml has no photos yet."; return; }
  const fromHash = Number(location.hash.slice(1));
  index = fromHash >= 1 && fromHash <= photos.length ? fromHash - 1 : 0;
  show();
})();
</script>
</body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--sort", action="store_true", help="sort gallery.yml by category and exit")
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()

    if args.sort:
        write_photos(sort_by_category(read_photos()))
        print(f"Sorted {FURNITURE_GALLERY} by category.")
        return

    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    url = f"http://localhost:{args.port}"
    print(f"Reviewing {len(read_photos())} photos at {url}. Ctrl+C to stop (saves are immediate).")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
    server.server_close()


if __name__ == "__main__":
    main()
