"use client";
import React from "react";
import { Theme } from "@/app/_lib/schemas";
import { getThemeByName } from "@/app/_lib/utils";

/*
  {
    _name: "",
    _light: true|false,
    txt: {
      l1: "text-[]",
      l2: "text-[]",
      l3: "text-[]",
      l4: "text-[]",
    },
    pkg: {
      frame: "bg-[]",
      content: "bg-[]",
      card: "bg-[] hover:bg-[]",
      button: "bg-[] hover:bg-[]",
      searchBar: "",
    },
  },
*/

export const themes: Theme[] = [
  {
    _name: "dracula",
    _light: false,
    txt: {
      l1: "text-[#F8F8F3]",
      l2: "text-[#6273A4]",
      l3: "text-[#BC93F9]",
      l4: "text-[#d3b6fc]",
      l5: "text-[#ff79c6]",
    },
    bg: {
      // --> pkg
      frame: "bg-[#282A36]",
      content: "bg-[#858bb0]", // nope
      card: "bg-[#20222C] text. hover:bg-[#BC93F9] hover:text-[#F8F8F3]", // nope
      button:
        "bg-[#282a36] text-[#d3b6fc] hover:bg-[#b5bad6] hover:text-[#F8F8F3]", // nope
      searchBar:
        "bg-[#858bb0] text-[#BC93F9] placeholder:text-[#F8F8F3] focus:border-[#ff79c6]", // nope
      // peer-focus:text-gray-900
    },
  },
  {
    _name: "vanilla",
    _light: true,
    txt: {
      l1: "text-[#020817]",
      l2: "text-[#64758B]",
      l3: "text-[]",
      l4: "text-[]",
      l5: "text-[]",
    },
    bg: {
      frame: "bg-[#FFF]",
      content: "bg-[]",
      card: "bg-[] hover:bg-[]",
      button: "bg-[] hover:bg-[]",
      searchBar: "",
    },
  },
];

export const ThemeContext = React.createContext(themes[0]);
