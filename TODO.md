## BEFORE SHARING
- first post button
- next/previous post buttons

- email not sending in prod


## REWRITE
- mobile/responsiveness
- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- make it so media in a posts's carousel is automatically taken from it's corresponding public/assets/posts/\<date\> folder, so as to remove the relevant metadata field
- refactor/break-out complex views & components
- refactor theme interface
- any remaining warnings
- doc tags in metadata blocks for better searching & organization
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- resume modal should also close via escape key

## AFTER REWRITE
- dockerize
- port to aws ecs