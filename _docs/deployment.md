# Deployment Guide

This guide covers running SleepyBlog locally and how it gets deployed to [sleepyblog.org](https://sleepyblog.org).

## Local Setup

Prerequisites: Node.js 18+, npm, Python 3.10+, and [prettier](https://prettier.io) (`brew install prettier`) for formatting.

```bash
npm install
pip install -r _tools/requirements.txt
npm run dev    # http://localhost:3000
```

`npm run dev` and `npm run build` both regenerate `app/_lib/utils/dataConfig.ts` from `app/_lib/data.yml` first (see [Data Configuration](data_configuration.md)).

### Commands

| Command                   | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `npm run dev`             | Start the dev server with hot reload                      |
| `npm run build`           | Build the production app                                  |
| `npm run start`           | Serve the production build (run `npm run build` first)    |
| `npm run lint`            | Run ESLint                                                |
| `npm run config:generate` | Regenerate `dataConfig.ts` from `data.yml`                |
| `./_tools/build.py`       | Lint and build, the pre-push check                        |
| `./_tools/new_post.py`    | Start a new post (asks for the date, type, and title)     |
| `./_tools/new_project.py` | Add a /software project (asks for everything)             |
| `./_tools/add_media.py`   | Upload staged photos to R2 and link them to a page        |
| `./_tools/publish.py`     | Build, then commit and push everything (asks first)       |
| `./_tools/format.py`      | Format Python with black, and TS/TSX/CSS/MD with prettier |
| `./_tools/help.py`        | Show the post workflow, tools, and docs                   |

### Environment Variables

Only the photo upload tool needs any. Set them in your shell profile (not `.env.local`, which the Python tools don't read):

```bash
export R2_ACCOUNT_ID=...          # Cloudflare account id (R2 overview page)
export R2_ACCESS_KEY_ID=...       # from an R2 API token (Object Read & Write)
export R2_SECRET_ACCESS_KEY=...
export R2_BUCKET=sleepyblog-media
```

## How Deployment Works

SleepyBlog is hosted on [Vercel](https://vercel.com) (Hobby/free tier), connected to the GitHub repo through Vercel's GitHub integration. **There are no GitHub Actions and no CI.** Vercel builds and deploys every push by itself:

| You push to | Vercel creates                                                |
| ----------- | ------------------------------------------------------------- |
| `main`      | A production deployment at sleepyblog.org                     |
| Any branch  | A preview deployment with its own URL (also linked on the PR) |

Vercel runs `npm run build`, which includes the `data.yml` config step, so the Vercel project needs no custom build settings.

### Publishing a Change

1. Run `./_tools/format.py`.
2. Run `./_tools/publish.py`. It runs `build.py` and stops if the build fails, since nothing else checks your code before Vercel builds it. Then it shows the changes, asks for a commit message (or pass `-m "message"`), and once you confirm, commits everything and pushes the current branch.
    - For bigger changes, push a branch, open a PR into `main`, and check the preview deployment before merging.
    - For a new post, committing straight to `main` is fine.
3. Watch the deployment in the Vercel dashboard. To redeploy without a new commit, open the deployment and choose **Redeploy**.

### When a Deployment Fails or Doesn't Show Up

- Check the commit's status on GitHub (the ✓/✗ next to the commit), or run `gh api repos/anthonybench/sleepyblog/commits/<sha>/statuses`. A failed Vercel build is listed there with a link to its logs.
- Vercel refuses to build Next.js versions with known security vulnerabilities. If a build fails for that reason, update `next` (Vercel often opens a PR to do it).
- The sidebar's "Last updated" date comes from the GitHub API at build time. If that request fails, it falls back to the build date.

## Analytics

[Vercel Web Analytics](https://vercel.com/docs/analytics) is enabled through the `<Analytics />` component in `app/layout.tsx`. View it under the project's **Analytics** tab in Vercel.

## Domain

The domain registration, its DNS, and the media storage are all on [Cloudflare](https://dash.cloudflare.com), so it's the only account besides Vercel and GitHub. Vercel issues the site's SSL certificate automatically.

- **Registration** (Cloudflare → Domain Registration): `sleepyblog.org` is registered through Cloudflare Registrar at cost, about $11/yr, and renews automatically. Paid through Mar 11, 2028.
- **DNS** (Cloudflare → `sleepyblog.org` → DNS): `A sleepyblog.org → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`, both **DNS only** (grey cloud). Vercel advises against Cloudflare's proxy in front of it. Vercel's side is under the project's **Settings → Domains**.
- **Media** (Cloudflare → R2 → `sleepyblog-media`): every photo and video, served at `https://media.sleepyblog.org/<id>.<ext>`. Photos also have a 1024px copy at `<id>h.<ext>`, which post galleries and `/furniture` load as thumbnails. `add_media.py` makes both (see [Furniture Gallery](furniture_gallery.md) for the `/furniture` side). The free tier covers 10 GB, and serving files costs nothing.
