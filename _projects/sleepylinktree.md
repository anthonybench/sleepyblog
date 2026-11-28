---
name: SleepyLinkTree
tagline: The GitHub Pages landing page where this blog's theme switcher and look were first prototyped.
status: maintained
year: 2019
order: 5
featured: false
tech: [typescript, next.js, tailwind, headless-ui, github-pages]
install: open https://anthonybench.github.io
links:
    - display_text: Live site
      url: https://anthonybench.github.io
    - display_text: GitHub
      url: https://github.com/anthonybench/anthonybench.github.io
media: []
---

## Motivation

A single page for career contacts: one place that points to this blog, LinkedIn, PyPI,
and GitHub. Small in scope on purpose, which made it the right place to experiment. It's
where I worked out how to theme a site properly, and the theme switcher and look you're
seeing on this blog started there.

## What's under the hood

- **Nine themes, one file each.** Dracula, Nord, Gruvbox, both Solarizeds, Monokai, and
  more. Each theme is a single CSS file that defines its palette as Tailwind v4 `@theme`
  tokens and its own utility classes (`gruvbox-text-primary`, `nord-bg-secondary`, ...).
  Components build their class names from the active theme, so adding a theme is one CSS
  file plus one line in a registry. No component changes.
- **Themes know whether they're light or dark.** Each registry entry carries a type, and
  the page uses it to swap artwork (light and dark versions of the logo, and an inverted
  GitHub mark that stays visible on any background) and to label the picker with ☀ or ☾.
- **An accessible theme picker.** Built on Headless UI's `Listbox`, so keyboard
  navigation, focus handling, and ARIA roles come for free, styled entirely by the theme
  utilities.
- **A bento grid.** A six-column CSS grid where the cards span 4 + 2, then 2 + 4, and
  only the grid's outer corners are rounded, so the four cards read as one tile. On a
  phone it collapses to a single column, rounded at the top and bottom.
- **Static export to GitHub Pages.** Next.js builds plain HTML, CSS, and JS
  (`output: "export"`, with image optimization off since there's no server). A GitHub
  Actions workflow builds and deploys every push to `main`, reusing Next's build cache
  between runs, keyed on the lockfile and source file hashes.

## What carried over to SleepyBlog

The theme registry with a light/dark type per theme, the picker in the top corner, the
JetBrains Mono and Comfortaa pairing, and Dracula as the default. What changed is the
mechanism: SleepyBlog's themes are CSS variables swapped by a `data-theme` attribute, so
components don't need to know which theme is active at all.

## Adding a theme

A theme is a palette plus the utilities that use it:

```css
/* app/themes/gruvbox.css */
@theme {
    --color-gruvbox-bg0_h: #fbf1c7;
    --color-gruvbox-blue: #458588;
    --color-gruvbox-green: #98971a;
}

@layer utilities {
    .gruvbox-bg-primary {
        background-color: var(--color-gruvbox-bg0_h);
    }
    .gruvbox-text-primary {
        color: var(--color-gruvbox-blue);
    }
}
```

...and one line to register it (the `codeName` matches the file name):

```tsx
// app/themes/switch-board.tsx
{ displayName: "Gruvbox", codeName: "gruvbox", type: "light" },
```

## Run it locally

```sh
git clone https://github.com/anthonybench/anthonybench.github.io
cd anthonybench.github.io
npm install
npm run dev
```
