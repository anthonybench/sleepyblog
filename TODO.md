# TODO

## Dockerize

- Build a Docker image from Next.js's standalone output (`output: "standalone"`) that runs anywhere with `docker run -p 3000:3000`
- Notes on publishing it to Docker Hub, kept in `_ephemeral/`

## Docstring coverage

- Add `interrogate` to `_tools/requirements.txt` (replacing the `# interrogate` placeholder) and have `build.py` fail below 100% coverage in `_tools/`

## Upgrade to Next.js 16

- Clears the remaining `npm audit` advisories (postcss and sharp bundled with Next 15); Vercel may eventually refuse to build a vulnerable version
- Bump `next` and `eslint-config-next` together, then check the build and OG images

## Google Search Console

- `app/layout.tsx` sets `verification: { google: "TODO" }`, which puts a junk meta tag on every page
- If ever wanted: verify sleepyblog.org with a DNS TXT record instead, delete the `verification` block, and submit `/sitemap.xml`
- Only worth it if posts become indexable; `app/robots.txt` currently has `Disallow: /posts/*`
