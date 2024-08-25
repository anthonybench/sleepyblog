// next
import type { Metadata } from "next";
// 1st party
import { UnderConstruction } from "../_components/under-construction";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Software Gallery",
  applicationName: "SleepyBlog",
  creator: "Isaac Yep",
  authors: [{ name: "Isaac Yep" }],
  metadataBase: new URL("http://sleepyblog.org"),
  openGraph: {
    type: "website",
    url: "https://sleepyblog.org",
    title: "SleepyBlog",
    description: "My personal & professional site; software projects showcase",
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
      <h3>Coming Soon: my software projects showcase...</h3>
      <UnderConstruction />
    </>
  );
}
