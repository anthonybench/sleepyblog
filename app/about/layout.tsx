// next
import type { Metadata } from "next";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "about the author",
  metadataBase: new URL("http://sleepyblog.org"),
};

// view
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
