# TODO

## Hot

### /furniture

A simple photo gallery of woodworking projects. Photos only, each with an optional caption. No per-piece pages or modals.

- Pick a layout to try (masonry, justified rows, polaroid scatter, filmstrip, ...); prototype two or three and keep the one that's fun to browse
- Store the gallery as a list of `{ url, caption? }` entries, e.g. `_furniture/gallery.yml`
- Host photos on R2 (media.sleepyblog.org), uploaded with `add_media.py` (add a furniture target that appends to the list and asks for a caption)
- Replace the "Coming Soon" stub in `app/furniture/page.tsx`
- Remove `/furniture` from `Disallow` in `app/robots.txt` and add it to `app/sitemap.ts`
- Write `_docs/furniture_gallery.md`

## Cold

### Dockerize

- Build a Docker image from Next.js's standalone output (`output: "standalone"`) that runs anywhere with `docker run -p 3000:3000`
- Notes on publishing it to Docker Hub, kept in `_ephemeral/`

### Docstring coverage

- Add `interrogate` to `_tools/requirements.txt` (replacing the `# interrogate` placeholder) and have `build.py` fail below 100% coverage in `_tools/`

### Upgrade to Next.js 16

- Clears the remaining `npm audit` advisories (postcss and sharp bundled with Next 15); Vercel may eventually refuse to build a vulnerable version
- Bump `next` and `eslint-config-next` together, then check the build and OG images

### Google Search Console

- `app/layout.tsx` sets `verification: { google: "TODO" }`, which puts a junk meta tag on every page
- If ever wanted: verify sleepyblog.org with a DNS TXT record instead, delete the `verification` block, and submit `/sitemap.xml`
- Only worth it if posts become indexable; `app/robots.txt` currently has `Disallow: /posts/*`
