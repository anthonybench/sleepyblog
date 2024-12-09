// next
import type { Metadata } from "next";
// 1st party
import { UnderConstruction } from "../_components/under-construction";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Tutoring/Coaching",
  applicationName: "SleepyBlog",
  creator: "Isaac Yep",
  authors: [{ name: "Isaac Yep" }],
  metadataBase: new URL("http://sleepyblog.org"),
  openGraph: {
    type: "website",
    url: "https://sleepyblog.org",
    title: "SleepyBlog",
    description: "My personal & professional site; tutoring services",
    siteName: "SleepyBlog",
    images: [
      {
        url: "https://i.imgur.com/ZHnNGeO.png",
      },
    ],
  },
};

// view
export default function Page() {
  return (
    <>
      <h3>Coming Soon: my tutoring services...</h3>

      {/* TODO:
        - sales pitch paragraph
          - link to /about
        - showcase degrees
        - relevant experience paragraphs in a 2-column grid
      */}

      {/* <p>
        TODO: sales pitch paragraph, including{" "}
        <a href="/about">take a peek at my resume if you&apos;re curious</a>
      </p>

      <p>TODO: a list of degrees</p> */}

      <UnderConstruction />
    </>
  );
}
