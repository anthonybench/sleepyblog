//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Software Gallery",
  metadataBase: new URL("http://sleepyblog.org"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Page() {
  return <h3>TODO: software projects gallery</h3>;
}
