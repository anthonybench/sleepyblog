# SleepyBlog

## Application File Structure

```txt
- _docs/ # documentation, more small files is preferred over large monolithic readme
- _posts/
    - <yyyy>-<mm>-<dd>.md // several blog posts
- _templates/
    - [yyyy-mm-dd.md](https://yyyy-mm-dd.md) // blog post template
    - page.tsx // new route template
- _tools/ # various tools i can run manually, only put things here when specifically instructed to
    - *.py
    - *.sh
- app/
    - _components/
        - *.tsx
    - _lib/
        - data.yml # easily changeable values used in the application, only put things here when specifically instructed to
        - fonts.ts # where fonts defined and exported from
        - styles/
            - main.css # takes all colors from selected color theme
            - themes/ # contains all colors that application uses everywhere
                - <theme>.css
        - utils/*.ts # functions the application uses
        - types/*.ts # types used in application
    - furniture/page.tsx
    - software/page.tsx
    - about/page.tsx
    - posts/[slug]/
        - not-found.tsx
        - page.tsx
    - test/page.tsx # there's no link to this anywhere, it's just for me to test things live, it's ok if it exists in production
    - layout.tsx
    - page.tsx
    - error.tsx
    - not-found.tsx # global not-found for routes that don't exist
    - favicon.ico
    - robots.txt
- public/
    - light/ # light-theme versions of images
        - *.svg
        - *.png
    - dark/ # dark-theme versions of images
        - *.svg
        - *.png
    - static/ # images that don't change with theme type
        - *.svg
        - *.png
        - *.gif
- <various_config_files>.*
- README.md # succinctly describe the project, explain how to deploy it, and links to documentation in `_docs/` when relevant
```

## UI Layout

The `SideNav` and `Header` components will exist in `app/layout.tsx`, while the "content" will be populated by the various `page.tsx` files.

### SideNav

The sidenav goes all the way to the top, and contains (in order from top to bottom):

- the logo `public/(light|dark)/sleepyboy_technologist.png`
- the nav links (in order from top to bottom):
    - /about
    - /software
    - /furniture
- a footer that contains (in order from top to bottom):
    - the paragraph:
      "
      Authored by
      Isaac Yep

        Last updated
        <last_git_commit_date>
        "

    - the image `public/(light|dark)/github.png` that is a link to: "https://github.com/anthonybench/sleepyblog/blob/main/README.md"

### Header

The header should have the same color as the side nav, so that the sidenav and header look like one body.
The header should contain (in order from left to right):

- The title "SleepyBlog" which is also a link to the home view.
- The ThemeSelector component

### Content

This is not a component, but rather the page content populated by `page.tsx`.

## Themes

The fonts for this application are comfortaa and jetbrains mono. Everything should use jetbrains mono unless otherwise stated.

All themes have:

- a `display_name` (example: "Dracula")
- an `alias` (example: "dracula")
- a `type` (either "light" or "dark")
- colors defined in `app/styles/themes/<alias>.css` (example: app/styles/themes/dracula.css)

Themes are selected from a dropdown select list in the header, with cute little moon and sun icons to the right of the display names to indicate if the theme is light or dark type.

Some images have light and dark versions (`public/dark/*` or `public/light/*`) that will be used depending on the selected theme type.

## Posts

Posts from `_posts/*.md` will be rendered in the application. All posts will be named `<yyyy>-<mm>-<dd>.md` (example: "2025-01-19.md"), and will have:

- `title`: found in the post file's metadata header
- `media`: a list of url strings for publicly hosted images and videos
- `type`: a string that can only be one of:
    - "land-development"
    - "software-development"
    - "build-things"
    - "rant"
- `post_date`: the date pulled from the file name
- `excerpt`: pulled from the h2 to be used as the post's preview text

The `type` will appear as a chip in the blog previews, and you can filter by tags. The post preview will also contain the date, title, and excerpt (the h2 in the post).
