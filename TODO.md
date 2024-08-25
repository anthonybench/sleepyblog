## CRITICAL ISSUES
- slugs array in _lib/utils should be dynamically generated
- date is both in filename and in metadata header, try to use filename so as to remove metadata field
- refactor theme interface
- tag field in post metadata for better organization (and show tag value as chip in post-preview)
- finish gh-actions workflows (see .github/workflows/lint_validation.yml)

## TUTORING
- sales pitch paragraph
  - link to /about
- showcase degrees
- relevant experience paragraphs in a 2-column grid

## FURNITURE
- infinite-scrolling paginated gallery grid

## SOFTWARE
- use same mechanism as posts

## REWRITE
- this time, with mobile-first approach
- dockerize
- port to aws `ecs` or `app runner`

## NON-CRITICAL ISSUES
- some remaining warnings
- evolve app/error.tsx:
  - *sleepyboy 'something went wrong' asset
- evolve app/blogs/[slug]/not-found.tsx:
  - *sleepyboy 'post not found' asset