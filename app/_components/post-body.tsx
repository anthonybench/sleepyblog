//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Link from "next/link";
// 3rd party
import { HomeIcon } from "@heroicons/react/24/outline";
// 1st party
import markdownStyles from "./post-styles.module.css";
import { Button } from "@/app/_components/button";
import { themes } from "@/app/_lib/themes";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
type Props = {
  content: string;
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function PostBody({ content }: Props) {
  return (
    <>
      <div className="mx-auto max-w-5xl ">
        <div
          className={markdownStyles["markdown"]}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div className="mx-auto max-w-sm">
        <Link href="/" className="flex justify-center">
          <Button className="hover:bg-indigo-400 hover:text-amber-300">
            <HomeIcon className="w-10 pr-3" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </>
  );
}
