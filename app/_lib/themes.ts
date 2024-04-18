import { Theme } from "@/app/_lib/schemas";

/*
  {
    _name: "",
    _light: true|false,
    text: {
      l1: "text-[]",
      l2: "text-[]",
      l3: "text-[]",
      l4: "text-[]",
    },
    background: {
      frame: "bg-[]",
      content: "bg-[]",
      card: "bg-[] hover:bg-[]",
      button: "bg-[] hover:bg-[]",
    },
    // in progress...
  },
*/

export const themes: Theme[] = [
  {
    _name: "dracula",
    _light: false,
    txt: {
      l1: "text-[#fefeff]",
      l2: "text-[#bd93f9]",
      l3: "text-[#924ff2]",
      l4: "text-[#6916e0]",
    },
    bg: {
      frame: "bg-[#44475a]",
      content: "bg-[#858bb0]",
      card: "bg-[#b1b5d0] hover:bg-[#c7cadf]",
      button: "bg-[#282a36] hover:bg-[#b5bad6]",
    },
    // in progress...
  },
  {
    _name: "vanilla",
    _light: true,
    txt: {
      l1: "text-[]",
      l2: "text-[]",
      l3: "text-[]",
      l4: "text-[]",
    },
    bg: {
      frame: "bg-[]",
      content: "bg-[]",
      card: "bg-[] hover:bg-[]",
      button: "bg-[] hover:bg-[]",
    },
    // in progress...
  },
];
