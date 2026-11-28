# Furniture Gallery (/furniture)

How the `/furniture` photo gallery works, and how to add, change, or remove photos.

## Adding Photos

1. **Stage them.** Drop the photos into `_media_staging/`. Phone photos are fine as they are, including iPhone HEIC. Videos and GIFs aren't supported here; the tool skips them and leaves them in place.
2. **Run the tool:**

    ```bash
    ./_tools/add_media.py --furniture    # or run it with no arguments and pick "The /furniture gallery"
    ```

    It processes the photos and shows the plan. Add `--dry-run` to stop there.

3. **Confirm, then answer a few questions per photo.** On a Mac it first offers to open the photos in Preview, in the same order as the questions, since camera filenames don't say much. For each photo:

    | Question | Notes                                                                                                  |
    | -------- | ------------------------------------------------------------------------------------------------------ |
    | Category | `tables`, `shelving`, `cabinetry`, `trim`, `seating`, or `not-furniture`. Defaults to the previous answer |
    | Caption  | Optional. Press Enter to leave it out                                                                  |
    | Featured | Featured photos show full width at the top of their category. Save it for your best work             |

    Nothing is uploaded until you've answered them all. Ctrl+C at any point cancels with nothing changed.

4. **It uploads and records them.**
    - Each photo is rotated upright, stripped of metadata (including GPS location), shrunk to 2560px, and uploaded to R2 with a 1024px copy. See `add_media.py` and [Deployment](deployment.md#domain).
    - An entry per photo is appended to `_furniture/gallery.yml`.
    - The originals move to `_media_staging/uploaded/furniture/`.
5. **Preview** with `npm run dev` at <http://localhost:3000/furniture>.
6. **Publish** with `./_tools/publish.py`, or push the branch and check the PR's preview.

The R2 env vars need to be set first (see [Deployment](deployment.md#environment-variables)).

For a big batch, `./_tools/bulk_load_furniture.py` does the same in a browser, one photo at a time: keep or delete it, rename it (saved as `.jpg`, converting CR2/HEIC/PNG), and set its category, caption, and featured flag. Each kept photo uploads in the background while you sort the next.

## The Gallery File

Everything the page shows comes from `_furniture/gallery.yml`. The tool only ever appends to it, keeping your comments and edits, so it's safe to edit by hand.

```yaml
photos:
    - url: https://media.sleepyblog.org/AbCd1234.jpg
      width: 1920
      height: 2560
      category: tables
      caption: "Walnut coffee table"
      featured: true
    - url: https://media.sleepyblog.org/EfGh5678.jpg
      width: 2560
      height: 1920
      category: seating
```

| Field      | Required | Notes                                                                                           |
| ---------- | -------- | ----------------------------------------------------------------------------------------------- |
| `url`      | yes      | The full-size photo on R2                                                                       |
| `width`    | yes      | Pixel size of that photo. The page reserves the space before it loads, so nothing jumps around |
| `height`   | yes      |                                                                                                 |
| `category` | yes      | Which tab it's under                                                                            |
| `caption`  | no       | Shown under the photo, and used as its alt text                                                 |
| `featured` | no       | `true` to show it full width at the top of its category                                         |

A mistake in the file (a missing field or a misspelled category) **fails the build** with a message naming the entry, rather than quietly hiding the photo.

### Common Edits

To review every photo one at a time in a browser and change its category, caption, or featured flag, run `./_tools/organize_furniture.py`. It keeps the file sorted by category (`--sort` just sorts it). Or edit the file by hand:

- **Reorder:** move entries up or down. Within a category, photos show in file order: the featured ones first, then the rest.
- **Change a caption, category, or featured flag:** edit the field.
- **Remove a photo:** delete its entry. The files stay on R2. They're harmless, but you can delete `<id>.jpg` and `<id>h.jpg` from the bucket in the Cloudflare dashboard (R2 → `sleepyblog-media`).

## How the Page Works

| File                                  | What it does                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `app/furniture/page.tsx`              | The page: header plus the gallery, with its metadata                           |
| `app/_lib/utils/furniture.ts`         | Reads and checks `gallery.yml` at build time                                   |
| `app/_lib/types/furniture.ts`         | The photo type and the category list (the tabs, in order)                      |
| `app/_components/FurnitureGallery.tsx` | The tabs, featured photos, and masonry columns                                |
| `app/_lib/utils/media.ts`             | `getThumbnailUrl()`: a photo's 1024px copy (shared with post galleries)        |
| `app/_lib/styles/main.css`            | The "Furniture" section at the end                                             |

- **Tabs:** one per category, always shown, even when empty ("Nothing here yet."). The page opens on the first category with photos. The selected tab is kept in the URL hash, so `sleepyblog.org/furniture#seating` links straight to it.
- **Featured photos** load full size, one per row. Their height is capped so tall photos don't fill several screens, and the leftover space shows a blurred copy of the same photo instead of cropping it.
- **The rest** load their 1024px copies in masonry columns (three on desktop, fewer on narrow screens).
- **Clicking any photo** opens the full-size original in a new tab.

## Adding or Renaming a Category

Categories live in two places that must match:

1. `furnitureCategories` in `app/_lib/types/furniture.ts`, which sets the tabs and their order.
2. `FURNITURE_CATEGORIES` in `_tools/add_media.py`, which sets the tool's choices.

When renaming, update the matching `category:` values in `gallery.yml` too, or the build fails.

## Search Engines

`/furniture` is allowed in `app/robots.txt` and listed in `app/sitemap.ts`.
