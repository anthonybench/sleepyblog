// next
import type { Metadata } from "next";
// 1st party
import { UnderConstruction } from "../_components/under-construction";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Furniture Gallery",
  metadataBase: new URL("http://sleepyblog.org"),
};

// view
export default function Page() {
  return (
    <>
      <h3>Coming Soon: my woodworking &amp; furniture gallery...</h3>
      <UnderConstruction />
    </>
  );
}
