"use client";

// next
import Script from "next/script";
// react
import { useState } from "react";
// 1st party
import "@/app/_lib/globals.css";
import "@/app/_lib/utils.css";
import { jetbrains_mono } from "@/app/_lib/fonts";
import Header from "@/app/_components/header";
import { ScrollArea } from "@/app/_components/scroll-area";
import SideNav from "@/app/_components/side-nav";
import { Theme } from "@/app/_lib/schemas";
import { getThemeByName } from "@/app/_lib/utils";
import { ThemeContext } from "@/app/_lib/themes";

// params
const defaultTheme = getThemeByName("dracula");

// view
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
      <ThemeContext.Provider value={selectedTheme}>
        <body
          className={`${jetbrains_mono.className} grid h-screen grid-cols-12 grid-rows-12 ${selectedTheme.pkg.frame}`}
        >
          {/* <Script
            strategy="afterInteractive"
            src="https://platform.linkedin.com/badges/js/profile.js"
          /> */}
          <div className={`col-span-2 row-span-12 `}>
            <SideNav />
          </div>
          <div className={`col-span-10 row-span-1 px-5`}>
            <Header
              selectedTheme={selectedTheme}
              onThemeChange={handleThemeChange}
            />
          </div>
          <main
            className={`col-span-10 row-span-11 mt-5 ${selectedTheme.pkg.content}`}
          >
            <ScrollArea className={`h-full p-10`}>{children}</ScrollArea>
          </main>
        </body>
      </ThemeContext.Provider>
    </html>
  );
}
