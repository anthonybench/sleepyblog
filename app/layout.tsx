"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// react
import { useState } from "react";
// 1st party
import "@/app/_lib/globals.css";
import "@/app/_lib/utils.css";
import { jetbrains_mono } from "@/app/_lib/fonts";
import Header from "@/app/_components/header";
import { ScrollArea } from "@/app/_components/scroll-area";
import SideNav from "@/app/_components/side-nav";
import { themes } from "@/app/_lib/themes";
import { Theme } from "@/app/_lib/schemas";
import { getThemeByName } from "@/app/_lib/utils";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
const defaultTheme = getThemeByName("dracula");

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultTheme);
  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(getThemeByName(newTheme));
  };
  return (
    <html lang="en">
      <body
        className={`${jetbrains_mono.className} grid h-screen grid-cols-12 grid-rows-12 text-[${selectedTheme.text.primary}] bg-[${selectedTheme.layoutBg}]`}
      >
        <div className={`col-span-2 row-span-12`}>
          <SideNav selectedTheme={selectedTheme} />
        </div>
        <div className={`col-span-10 row-span-1 px-5`}>
          <Header
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </div>
        <main
          className={`col-span-10 row-span-11 mt-5 bg-[${selectedTheme.mainBg}]`}
        >
          <ScrollArea className="h-full rounded-md border p-10">
            {children}
          </ScrollArea>
        </main>
      </body>
    </html>
  );
}
