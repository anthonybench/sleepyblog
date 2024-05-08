## PRE-REWRITE
- clsx isn't as great as i thought:
  - clsx for 'active navlink highlight colors' only works for dracula/default
  - selected navlink has static styles, can't figure out how to inject variables/string-interpolation

- move images to imgur (maybe video too?)

- replace react-modal with shadcn's dialog

- replace last-updated-date.ts with github api call
  - https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28

- email not sending in prod

- mobile/responsiveness

- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- pre-commit/husky run prettier
- evolve readme
- any remaining warnings


## POST-REWRITE
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- dockerize
- port to aws ecs