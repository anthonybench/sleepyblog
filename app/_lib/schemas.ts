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
    navLinkSelected: string;
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
