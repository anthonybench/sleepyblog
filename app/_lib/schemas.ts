export type Post = {
  slug: string;
  title: string;
  date: string;
  media: string[];
  excerpt: string;
  content: string;
  preview?: boolean;
};

export type Theme = {
  name: string;
  lightDark: string;
  layoutBg: string;
  mainBg: string;
  text: {
    primary: string;
    secondary: string;
  };
  smallButton: {
    // send-email & return-home
    bg: string;
    hoverBg: string;
  };
  cardButton: {
    // nav-links & post-previews
    bg: string;
    hoverBg: string;
    hoverPrimary: string;
    hoverSecondary: string;
  };
};

export interface ThemeProps {
  selectedTheme: Theme;
  onThemeChange: (newTheme: string) => void;
}

export type SleepyDate = {
  year: number;
  month: number;
  day: number;
};
