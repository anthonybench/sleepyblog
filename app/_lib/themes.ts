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
    name: "dracula",
    lightDark: "dark",
    layoutBg: "#282a36",
    mainBg: "#53597c",
    text: {
      primary: "#fb31a5",
      secondary: "#bd93f9",
    },
    smallButton: {
      bg: "#9ba0c0",
      hoverBg: "#ffc4e6",
    },
    cardButton: {
      bg: "#9ea4c8",
      hoverBg: "#b5bad6",
      hoverPrimary: "#8e0855",
      hoverSecondary: "#491298",
    },
  },
  {
    name: "vanilla",
    lightDark: "light",
    layoutBg: "#d2d3db",
    mainBg: "#fafafa",
    text: {
      primary: "#000000",
      secondary: "#363534",
    },
    smallButton: {
      bg: "#333333",
      hoverBg: "#e3ca86",
    },
    cardButton: {
      bg: "#c2c1be",
      hoverBg: "#bfb9a8",
      hoverPrimary: "#000000",
      hoverSecondary: "#363534",
    },
  },
];
