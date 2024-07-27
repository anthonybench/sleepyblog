## CRITICAL ISSUES
- some functions in _lib/utils should be refactored to use server-actions
- date is both in filename and in metadata header, try to use filename so as to remove metadata field

## REWRITE
- mobile/responsiveness
- refactor/break-out complex views & components
- refactor theme interface
- any remaining warnings
- tag field in metadata blocks for better organization
- accessability
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset
- resume modal should also close via escape key

## AFTER REWRITE
- dockerize
- port to aws ecs