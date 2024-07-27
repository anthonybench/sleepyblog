"use client"; // because styles

// next
import Link from "next/link";
// 1st party
import { ThemeContext } from "@/app/_lib/themes";
import { Button } from "@/app/_components/button";
import { getRandomPost } from "@/app/_lib/utils";

// view
export function FirstRandomButtonCluster() {
  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <div className={`py-5`}>
          <Link href="/posts/2024-02-29" className="">
            <Button variant="outline" className={`${selectedTheme.pkg.button}`}>
              <span>First Post</span>
            </Button>
          </Link>
          <Link href={getRandomPost()} className="">
            <Button variant="outline" className={`${selectedTheme.pkg.button}`}>
              <span>Random 🎲</span>
            </Button>
          </Link>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
