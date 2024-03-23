"use client";
/*
  this only exists because:
  by having a middle man for the header, i can create the state here, and not require 'use client' in the root layout to allow metadata to be gobally set
*/
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// react
import { useState } from "react";
// 1st party
import Header from "@/app/_components/header";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function HeaderWrapper() {
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
  };
  return (
    <Header selectedTheme={selectedTheme} onThemeChange={handleThemeChange} />
  );
}
