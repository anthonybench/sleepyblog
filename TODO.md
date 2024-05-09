## PRE-REWRITE
- clsx isn't as great as i thought:
  - clsx for 'active navlink highlight colors' only works for dracula/default
  - selected navlink has static styles, can't figure out how to inject variables/string-interpolation

- move images to imgur (maybe video too?)

- replace last-updated-date.ts with github api call
  - https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28

- email not sending in prod

- mobile/responsiveness

- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- make it so media in a posts's carousel is automatically taken from it's corresponding public/assets/posts/\<date\> folder, so as to remove the relevant metadata field

- pre-commit/husky run prettier
- any remaining warnings


## POST-REWRITE
- evolve readme
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- resume modal should also close via escape key
- dockerize
- port to aws ecs