"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Link from "next/link";
// 1st party
import "@/app/_lib/utils.css";
import { dateFormatter } from "@/app/_lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/card";
import { ThemeContext } from "@/app/_lib/themes";
import { SelectGroup } from "@radix-ui/react-select";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
type Props = {
  title: string;
  date: Date;
  excerpt: string;
  slug: string;
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function PostPreview({ title, date, excerpt, slug }: Props) {
  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <Card className={`${selectedTheme.bg.card}`}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{dateFormatter(date)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{excerpt}</p>
            </CardContent>
          </Card>
        </Link>
      )}
    </ThemeContext.Consumer>
  );
}
