export type Blog = {
  slug: string;
  title: string;
  date: string;
  media: string[];
  excerpt: string;
  content: string;
  preview?: boolean;
};