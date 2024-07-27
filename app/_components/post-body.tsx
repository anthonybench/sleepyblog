"use client";

// next
import Link from "next/link";
// 3rd party
import { HomeIcon } from "@heroicons/react/24/outline";
// 1st party
import markdownStyles from "@/app/_components/post-styles.module.css";
import { Button } from "@/app/_components/button";
import { ThemeContext } from "@/app/_lib/themes";

// params
type Props = {
  content: string;
};

// view
export function PostBody({ content }: Props) {
  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <>
          <div className="mx-auto max-w-5xl ">
            <div
              className={markdownStyles["markdown"]}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          <div className="mx-auto flex max-w-sm justify-center">
            {/* 🚧 previous button; if previous date exists */}
            <Link href="/" className="">
              <Button
                variant="outline"
                className={`${selectedTheme.pkg.button}`}
              >
                <span>← Prev</span>
              </Button>
            </Link>
            {/* 🚧 */}
            <Link href="/" className="">
              <Button
                variant="outline"
                className={`${selectedTheme.pkg.button}`}
              >
                <HomeIcon className="w-10 pr-3" />
                <span>Return Home</span>
              </Button>
            </Link>
            {/* 🚧 next button; if next date exists */}
            <Link href="/" className="">
              <Button
                variant="outline"
                className={`${selectedTheme.pkg.button}`}
              >
                <span>Next →</span>
              </Button>
            </Link>
            {/* 🚧 */}
          </div>
        </>
      )}
    </ThemeContext.Consumer>
  );
}
