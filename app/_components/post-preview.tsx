"use client";

// next
import Link from "next/link";
// 1st party
import "@/app/_lib/utils.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/card";
import { ThemeContext } from "@/app/_lib/themes";
import { SelectGroup } from "@radix-ui/react-select";

// params
type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

// view
export function PostPreview({ title, date, excerpt, slug }: Props) {
  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <Card className={`group ${selectedTheme.pkg.cardButton}`}>
            <CardHeader className="">
              <CardTitle className={`${selectedTheme.txt.cardButtonHover}`}>
                <p className={``}>{title}</p>
              </CardTitle>
              <CardDescription
                className={`${selectedTheme.txt.cardButtonHover}`}
              >
                {date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`${selectedTheme.txt.content}`}>{excerpt}</p>
            </CardContent>
          </Card>
        </Link>
      )}
    </ThemeContext.Consumer>
  );
}
