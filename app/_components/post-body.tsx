"use client";

// next
import Link from "next/link";
// 3rd party
import { HomeIcon } from "@heroicons/react/24/outline";
// 1st party
import markdownStyles from "./post-styles.module.css";
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
          <div className="mx-auto max-w-sm">
            <Link href="/" className="flex justify-center">
              <Button
                variant="outline"
                className={`${selectedTheme.pkg.button}`}
              >
                <HomeIcon className="w-10 pr-3" />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>
        </>
      )}
    </ThemeContext.Consumer>
  );
}
