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
  _name: string;
  _light: boolean;
  text: {
    l1: string;
    l2: string;
    l3: string;
    l4: string;
  };
  background: {
    card: string;
    cardHover: string;
    button: string;
    buttonHover: string;
  };
  // in progress...
};

export type SleepyDate = {
  year: number;
  month: number;
  day: number;
};
