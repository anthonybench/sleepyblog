//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "about the author",
  metadataBase: new URL("http://sleepyblog.org"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
