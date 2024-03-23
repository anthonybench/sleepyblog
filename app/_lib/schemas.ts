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

// 🚧
export type Theme = {
  lightDark: string;
  text: {
    primary: string;
    secondary: string;
  };
  mainBg: string;
  layoutBg: string;
  blogPreview: {
    bg: string;
    hoverBg: string;
    hoverPrimary: string;
    hoverSecondary: string;
  };
  button: {
    bg: string;
    hoverBg: string;
  };
};
