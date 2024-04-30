## GO
- real posts...

## PRE-REWRITE
- replace react-modal with shadcn's dialog
- clsx isn't as great as i thought:
  - clsx for 'active navlink highlight colors' only works for dracula/default
  - selected navlink has static styles, can't figure out how to inject variables/string-interpolation
- email not sending in prod
- pre-commit/husky run prettier
- mobile/responsiveness
- linkedin badge is dumb
  - switching themes adds weird padding thing around badge
  - linkedin badge disappears when you navigate away & back, refresh fixes it but kills my theme state so that's a no-go
- can't navigate internal links when you refresh while in a post view
- any remaining warnings

## POST-REWRITE
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- dockerize
- port to aws ecs