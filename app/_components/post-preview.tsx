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
import { themes } from "@/app/_lib/themes";

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
    <Link as={`/posts/${slug}`} href="/posts/[slug]">
      <Card className="hover:bg-sky-100 hover:text-blue-600">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{dateFormatter(date)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
