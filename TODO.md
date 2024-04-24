## GO
- finish sleepyboy technologist
- break out linkedin badge as component
- filter unused packages

- post image & video broken in prod
- email not sending in prod

## STAGING
- real posts

## PRE-REWRITE
- robots.txt
- replace react-modal with shadcn's dialog
- warning: "The label's for attribute doesn't match any element id."
- mobile/responsiveness
- linkedin badge is dumb:
  - doesn't respond to light/dark change, likely because it's some stupid script, maybe do a server-action thing
  - disappears when you navigate away & back, refresh fixes it but kills my theme state so that's a no-go
- clsx isn't as great as i thought:
  - clsx for 'active navlink highlight colors' only works for dracula/default
  - selected navlink has static styles, can't figure out how to inject variables/string-interpolation
- can't navigate internal links when you refresh while in a post view
- pre-commit/husky run prettier

## POST-REWRITE
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- dockerize
- port to aws ecs