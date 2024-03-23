export type Post = {
  slug: string;
  title: string;
  date: string;
  media: string[];
  excerpt: string;
  content: string;
  preview?: boolean;
};

export interface ThemeProps {
  selectedTheme: string;
  onThemeChange: (newTheme: string) => void;
}
