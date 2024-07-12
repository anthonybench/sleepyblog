# **SleepyBlog**

_a blog most sleepy._

<br />

## **Welcome to SleepyBlog 👋**

A web app for personal utility, both career and professional.

SleepyBlog serves as a convenient place to host my resume, document my land development journey with my partner Jean, a gallery for projects, and any other personal whimsies.

[✨***Check out SleepyBlog***✨](https://sleepyblog.org)

<br />

### **Table of Contents** 📖

<hr>

- [Welcome](#welcome-to-sleepyblog)
- [**Get Started**](#get-started-)
- [Usage](#usage-)
- [Technologies](#technologies-)
- [Connect](#connect-)
- [Acknowledgements](#acknowledgements-)
- [License/Stats/Author](#license-stats-author-)

<br />

## **Get Started 🚀**

<hr>

This app is hosted on vercel, with namecheap as it's dns provider. \
Later, its design will be overhauled, dockerized, and migrated to the cloud.

As it stands, this app is simple:
```sh
npm i
pip install -r requirements.txt
npm run dev
npm build
```

Git hooks are maintained via husky, which is further explained in the [usage section](#usage-), and can be installed with:
```sh
npx husky init
```

Vercel's ci/cd via GitHub app connection automatically rebuilds pushes to the `main` branch into production. Only the repository owner can force push.

<br />

## **Usage ⚙**

<hr>

The core anatomy is as such:
| Path Glob | Description |
| --- | --- |
| `_posts/*` | blog posts |
| `_tools/*` | tools to support workflow & maintenance |
| `app/_components/*` | react components  |
| `app/_lib/*` | typescript & css utilities, themes and other global objects |
| `app/about/*` | resume & connect page |
| `app/furniture/*` | furniture gallery |
| `app/software/*` | software gallery |
| `app/tutoring/*` | tutoring interface |
| `app/posts/*` | blog post view |
| `public/assets/general/*` | images and other files for the rest of sleepyblog |

As for git hooks, file `.husky/pre-commit` will be run before a commit, and is both for formatting and setting the last updated date displayed in the side-nav footer.

<br />

## **Technologies 🧰**

<hr>

- [namecheap](https://www.namecheap.com/)
- [gray-matter](https://www.npmjs.com/package/gray-matter)
- [Next.js 14](https://nextjs.org/docs)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [remark](https://github.com/remarkjs/remark-html)
- [zod](https://zod.dev/)
- [Tailwind](https://tailwindcss.com/docs/grid-auto-flow)
- [shadcn](https://ui.shadcn.com/docs/components)
- [Vercel](https://nextjs.org/docs/deployment)
- [imgur-python](https://faustocarrera.github.io/imgur-python/)
- [husky](https://typicode.github.io/husky/)
- [prettier](https://www.npmjs.com/package/prettier)
- [black](https://github.com/psf/black)

<br />

## **Connect 🤝**

<hr>

Though I'm not much for conventional social media, feel free to connect with me where ever I've resigned to exist!
- [LinkedIn](https://linkedin.com/in/anthonybench)
- [DuoLingo](https://duolingo.com/profile/thesleepyboy)
- [MonkeyType](https://monkeytype.com/profile/boysleepy)
- [GitHub](https://github.com/anthonybench)
- [PyPI](https://pypi.org/user/sleepyboy)
- [Docker](https://hub.docker.com/u/sleepyboy)

<br />

## **Acknowledgements 💙**

<hr>

A lifetime of thanks to my partner Jean, who never stops loving and supporting me. \
Another to my parents, Victor Yep & Jeannie Bench.

<br />

## **License, Stats, Author 📜**

<hr>

<img align="right" alt="example image tag" src="https://i.imgur.com/jtNwEWu.png" width="200" />

<!-- badge cluster -->

![GitHub repo size](https://img.shields.io/github/repo-size/anthonybench/sleepyblog)
![GitHub top language](https://img.shields.io/github/languages/top/anthonybench/sleepyblog)
![GitHub License](https://img.shields.io/github/license/anthonybench/sleepyblog)

<!-- / -->

See [License](LICENSE) for the full license text.

This project was authored by _Isaac Yep_.

[Back to Table of Contents](#table-of-contents-)
