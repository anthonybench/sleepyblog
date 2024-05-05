## PRE-REWRITE
- update templates
- tighten up github settings/restrictions
- metadata everywhere
- move images to imgur (maybe video too?)
- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- replace react-modal with shadcn's dialog
- posts media should work via co-location; should not have to enumerate filenames in respective assets folder
- clsx isn't as great as i thought:
  - clsx for 'active navlink highlight colors' only works for dracula/default
  - selected navlink has static styles, can't figure out how to inject variables/string-interpolation
- evolve readme
- email not sending in prod
- pre-commit/husky run prettier
- mobile/responsiveness
- can't navigate internal links when you refresh while in a post view
- replace last-updated-date.ts with github api call
  - https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28
- any remaining warnings

## POST-REWRITE
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- dockerize
- port to aws ecs