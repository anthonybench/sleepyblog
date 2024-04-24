export type Post = {
  slug: string;
  title: string;
  date: string;
  media: string[];
  excerpt: string;
  content: string;
  preview?: boolean;
};

// export type Theme = {
//   _name: string;
//   _light: boolean;
//   txt: {
//     l1: string;
//     l2: string;
//     l3: string;
//     l4: string;
//     l5: string;
//     iconFocus: string;
//   };
//   bg: {
//     frame: string;
//     content: string;
//     card: string;
//     button: string;
//     searchBar: string;
//     separator: string;
//   };
// };
export type Theme = {
  _name: string;
  _light: boolean;
  txt: {
    title: string;
    subtitle: string;
    muted: string;
    content: string;
    cardButtonHover: string;
  };
  pkg: {
    frame: string;
    navLink: string;
    content: string;
    cardButton: string;
    button: string;
    searchBar: string;
    separator: string;
    iconFocus: string;
    themePicker: string;
    emailSender: string;
  };
};

export type SleepyDate = {
  year: number;
  month: number;
  day: number;
};
