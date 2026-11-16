# TODO

## PHASE 1

### General

- change all `_tools/*` to python tools
- refactor python tools for style and consistency
  - all functions have docstrings and type hinting. if the functions is "obvious" or simple in nature, it should have a one line docstring that succinctly states what it does, but if more complex than that, the best practices full function docstring format
  - run black (as demonstrated in `_tools/format.sh`, which also please scrutinize if my black call has un-needed flags in it)
  - make sure the `_tools/help.py` tool and the documentation are all correct, in light of the fact that now there is no github action or automation anymore, and I simply commit to main then redeploy in vercel manually
- give color themes some kind of texture or gradient on the "conjoined header side-nav frame thing"
  - or maybe just give the color themes a little more depth, they feel a little flat as of now

## PHASE 2

#### Tooling

- my current photos workflow is annoying; maybe write tooling than what i currently have. I want to shove my photos for a post in `_media_staging/` and run some script and just have all the photos uploaded in an organized manner, and linked in the stubbed post
  - actually in general, my post workflow i think could be improved. it is outlined in `_ephemeral/notes.md`. Read that and look at my tooling and offer a suggestion.

### Route; /

- on desktop, the "first post" and "random post" buttons don't add together to take up the same width as the posts below it or the search bar + filter select-list above it. Please align those widths
- on mobile, the search bar isn't the same width as the filter select-list. Please align those widths, ideally to the "first post" and "random post" buttons

### Route; /about

- "Human who builds things" -> "I'm compelled to builds things"
- make the linkedin image take the same vertical space as the link cards
- make the open graph image better, namely more in line with the open graph image for `/`

## PHASE 3

### Route; /furniture (investigate before executing)

- Time to implement the furniture page! I want this page to be a photo gallery of wood working projects. Tell me a cool way to do this that's reliable, and not too complex, and should i continue hosting my images on imgur for this? I don't want to pay for anything. I want the process of adding a new image to have tooling so that it's simple to do if i haven't done it in a while, and also a doc in `_docs/`

### Route; /software (investigate before executing)

- Time to implement the software page! I want this page to be a showcase for software projects, one at a time (as in don't show them all the info about all the projects at once). I'm unsure if I want a flip-book/carousel experience with simple next/previous buttons, for if I want some sort of menu view with an arrangement of cards, and the user clicks a card (project) which opens a modal, or moves to a new page. Actually as I type this and think more on it, I think I do want the menu that takes you to a new page, as I can then send project specific links to people if i wanna share a particular project. How might we design an interesting preview card menu? I want the process of adding a new project to have tooling so that it's simple to do if i haven't done it in a while, and also a doc in `_docs/`

## PHASE 4

## Dockerize

- write as a docker container that I could run on any web server
- write documentation on how to upload to dockerhub, but put it in `_ephemeral/` so it doesn't get tracked by git
- implement interrogate for `_tools/*.py docstrings`

### investigate these before executing

- google search console: ownership verification
  - `metadata.verification.google` in `app/layout.tsx`
- could my app be re-written and optimized without nextjs? I have this hosted on vercel within a free tier so there's no real motivation to minimize the footprint of the app, but would be good just to know
