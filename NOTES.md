# notes from tutorial
- co-location :: components & pages are both in app/ together
- page.tsx & layout.tsx
- app/utils/*.ts
- app/components/*.tsx
- app/fonts.ts
- public/*.[png|ico]
- import { inter } from '@/app/ui/fonts'; // @ is an alias to make import paths simpler
- conditional styling :: clsx{}
- app/dashboard/page.tsx has an async page
- data fetching :: waterfall () vs. parallel
- (folder) is a 'rout group', and won't be part of the url
- adding a loading.tsx file implements page streaming
- specific components streaming is called 'suspense'
- import { useSearchParams, usePathname, useRouter } from 'next/navigation';
- debouncing :: only refresh search query params when user has stopped typing

# content overview
Miro Diagram:
  https://miro.com/app/board/uXjVOl1mFxw=/

sideBar {
  sleepyBoy : (vectorized png),
  nav       : [About, Software, Tutoring, Furniture],
  info      : [(link to repo), "Authored by Isaac Yep", "Last updated <m>/<d>/<y>"]
}

header {
  homeLink    : "SleepyBlog",
  themeSelect : (select list dropdown)
}

content { // views
  home      : (blog previews),
  blog      : (blog document),
  about     : [(blurb), (linkedin badge), (github link), (resume)],
  software  : 🚧,
  tutoring  : 🚧,
  furniture : 🚧
}

# stack
| Technology   | Description                            |
|--------------|----------------------------------------|
| Next         | react framework                        |
| ShadCN       | custom component library tool          |
| Tailwind     | css framework                          |
| v0           | web tool to generate shadcn components |
| Vercel       | hosting                                |