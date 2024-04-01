# **SleepyBlog**

_a blog most sleepy._

<br />

## **Welcome to sleepyblog 👋**

A web app for personal & career utility.

<br />

### **Table of Contents** 📖

<hr>

- [Welcome](#welcome-to-sleepyblog)
- [**Get Started**](#get-started-)
- [Usage](#usage-)
- [Technologies](#technologies-)
- [Contribute](#Contribute-)
- [Acknowledgements](#acknowledgements-)
- [License/Stats/Author](#license-stats-author-)

<br />

## **Get Started 🚀**

<hr>

This app is hosted on vercel, with hostname/dns/ssl provided by namecheap.
Later, it will be dockerized and migrated to aws via terraform.

As it stands, this app is simple:
```sh
npm i
npm run dev
npm build
```

<br />

## **Usage ⚙**

<hr>

The core anatomy is as such:
| **Path Glob** | Description |
| --- | --- |
| `posts/*` | blog posts |
| `app/_components/*` | react components  |
| `app/_lib/*` | typescript & css utilities, themes and other global objects |
| `app/about/*` | resume & connect page |
| `app/furniture/*` | furniture gallery |
| `app/software/*` | software gallery |
| `app/tutoring/*` | tutoring interface |
| `app/posts/*` | blog post view |
| `public/assets/posts/*` | images and other files for posts |
| `public/assets/general/*` | images and other files for the rest of sleepyblog |

Style and tailwind class order is handled with:
```sh
prettier -w ./
```

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

<br />

## **Contribute 🤝**

<hr>

If you like colors and have a theme idea, submit a PR!

<br />

## **Acknowledgements 💙**

<hr>

A lifetime of thanks to my partner Jean, who supports me greatly. \
Another to my parents, Jeannie & Victor.

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
