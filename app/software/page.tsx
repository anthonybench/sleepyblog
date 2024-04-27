//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
// 1st party
import { UnderConstruction } from "../_components/under-construction";

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
  return (
    <>
      <h3>Coming Soon: my software projects gallery...</h3>
      <UnderConstruction />
    </>
  );
}
