import Link from "next/link";
import "@/app/_lib/utils.css";
import { dateFormatter } from "@/app/_lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/card";

type Props = {
  title: string;
  date: Date;
  excerpt: string;
  slug: string;
};

export function BlogPreview({ title, date, excerpt, slug }: Props) {
  return (
    <Link as={`/blogs/${slug}`} href="/blogs/[slug]">
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
