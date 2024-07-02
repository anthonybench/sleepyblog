## BEFORE SHARING
- replace last-updated-date.ts with github api call
  - https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28
- pre-commit/husky run prettier

- move images to imgur (maybe video too?)
- first post button
- next/previous post buttons
- email not sending in prod
- refactor theme interface
- evolve readme

## BEFORE REWRITE
- mobile/responsiveness
- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- make it so media in a posts's carousel is automatically taken from it's corresponding public/assets/posts/\<date\> folder, so as to remove the relevant metadata field
- refactor/break-out complex views & components
- any remaining warnings
- doc tags

## AFTER REWRITE
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- resume modal should also close via escape key
- dockerize
- port to aws ecs