"use client";
import React from "react";
import { Theme } from "@/app/_lib/schemas";
/*
{
    _name: "",
    _light: true|false,
    txt: {
      title: "text-[]",
      subtitle: "text-[]",
      muted: "text-[]",
      content: "text-[]",
      cardButtonHoverTitle: "text-[]",
      cardButtonHoverDate: "text-[]",
    },
    pkg: {
      frame: "bg-[]",
      navLink: "bg-[] border-[] hover:bg-[] text-[] hover:text-[]",
      content: "text-[] bg-[]",
      cardButton: "bg-[] border-[] hover:bg-[] text-[]",
      button: "border-[] bg-[] text-[] hover:bg-[] hover:text-[]",
      searchBar: "bg-[] border-2 border-[] placeholder:text-[] focus:border-[]",
      separator: "bg-[]",
      iconFocus: "peer-focus:stroke-[]",
      themePicker: "bg-[] text-[] border-[]",
      emailSender: "border-[]"
    },
  },
*/

export const themes: Theme[] = [
  {
    _name: "dracula",
    _light: false,
    txt: {
      title: "text-[#d3b6fc]",
      subtitle: "text-[#BC93F9]",
      muted: "text-[#6273A4]",
      content: "text-[#F8F8F3]",
      cardButtonHover: "group-hover:text-[#000000]",
    },
    pkg: {
      frame: "bg-[#20222C]",
      navLink:
        "bg-[#20222C] border-[#d3b6fc] hover:bg-[#BC93F9] text-[#BC93F9] hover:text-black",
      content: "text-[#F8F8F3] bg-[#282A36]",
      cardButton:
        "bg-[#20222C] border-[#d3b6fc] hover:bg-[#BC93F9] text-[#BC93F9]",
      button:
        "border-[#d3b6fc] bg-[#282a36] text-[#d3b6fc] hover:bg-[#b5bad6] hover:text-black",
      searchBar:
        "bg-[#858bb0] border-2 border-[#d3b6fc] placeholder:text-[#F8F8F3] focus:border-[#ff79c6]",
      separator: "bg-[#d3b6fc]",
      iconFocus: "peer-focus:stroke-[#ff79c6]",
      themePicker: "bg-[#20222C] text-[#F8F8F3] border-[#d3b6fc]",
      emailSender: "border-[#d3b6fc]",
    },
  },
  {
    _name: "overcast",
    _light: true,
    txt: {
      title: "text-[#0F172A]",
      subtitle: "text-[#020817]",
      muted: "text-[#64748B]",
      content: "text-[#0F172A]",
      cardButtonHover: "group-hover:text-[#5298B4]",
    },
    pkg: {
      frame: "bg-[#F1F5F9]",
      navLink:
        "bg-[#F1F5F9] border-[#0F172A] hover:bg-[#020817] text-[#020817] hover:text-white",
      content: "text-[#0F172A] bg-[#FFFFFF]",
      cardButton:
        "bg-[#F1F5F9] border-[#0F172A] hover:bg-[#D1D5DB] text-[#020817]",
      button:
        "border-[#0F172A] bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F8FAFC] hover:text-white",
      searchBar:
        "bg-[#d1d5db] border-2 border-[#0F172A] placeholder:text-[#0F172A] focus:border-[#E2E8F0]",
      separator: "bg-[#D1D5DB]",
      iconFocus: "peer-focus:stroke-[#E2E8F0]",
      themePicker: "bg-[#F1F5F9] text-[#0F172A] border-[#0F172A]",
      emailSender: "border-[#0F172A]",
    },
  },
];

export const ThemeContext = React.createContext(themes[0]);
