// next
import type { Metadata } from "next";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "About the Author",
  applicationName: "SleepyBlog",
  creator: "Isaac Yep",
  authors: [{ name: "Isaac Yep" }],
  metadataBase: new URL("http://sleepyblog.org"),
  openGraph: {
    type: "website",
    url: "https://sleepyblog.org",
    title: "SleepyBlog",
    description: "My personal & professional site; about me.",
    siteName: "SleepyBlog",
    images: [
      {
        url: "https://i.imgur.com/ZHnNGeO.png",
      },
    ],
  },
};

// view
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
