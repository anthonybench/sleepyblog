// next
import type { Metadata } from "next";
// 1st party
import { UnderConstruction } from "../_components/under-construction";

// params
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "Tutoring/Coaching",
  metadataBase: new URL("http://sleepyblog.org"),
};

// view
export default function Page() {
  return (
    <>
      <h3>Coming Soon: my tutoring self-promotion...</h3>
      <UnderConstruction />
    </>
  );
}
