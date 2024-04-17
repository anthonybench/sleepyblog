import { Theme } from "@/app/_lib/schemas";

/*
  {
    name: "",
    lightDark: "",
    layoutBg: "",
    mainBg: "",
    text: {
      primary: "",
      secondary: "",
    },
    smallButton: {
      bg: "",
      hoverBg: "",
    },
    cardButton: {
      bg: "",
      hoverBg: "",
      hoverPrimary: "",
      hoverSecondary: "",
    },
  },
*/

export const themes: Theme[] = [
  {
    _name: "dracula",
    _light: false,
    text: {
      l1: "",
      l2: "",
      l3: "",
      l4: "",
    },
    background: {
      card: "",
      cardHover: "",
      button: "",
      buttonHover: "",
    },
    // in progress...
  },
  {
    _name: "vanilla",
    _light: true,
    text: {
      l1: "",
      l2: "",
      l3: "",
      l4: "",
    },
    background: {
      card: "",
      cardHover: "",
      button: "",
      buttonHover: "",
    },
    // in progress...
  },
];