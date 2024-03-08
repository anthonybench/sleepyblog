import type { Metadata } from "next";
import { inter, jetbrains_mono, fira_code, roboto_mono } from "@/app/_lib/fonts";
import "@/app/_lib/globals.css";
import "@/app/_lib/utils.css";
import Header from "@/app/_components/header";
import SideNav from "@/app/_components/sidenav";
import YASN from "@/app/_components/yasn";
// import YasnTheSequel from "@/app/_components/yasnthesequel";
import MoreSideBar from "@/app/_components/moresidebar";
import { ScrollArea } from "@/app/_components/scroll-area"


export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "A blog so sleepy.",
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'), // ?
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains_mono.className} grid h-screen grid-cols-12 grid-rows-12`}>
        <SideNav className={`col-span-2 row-span-12`} />
        <Header className={`col-span-10 row-span-1 px-5`} />
        <main className={`col-span-10 row-span-11`}>
          <ScrollArea className="h-full rounded-md p-10 border">
            {children}
          </ScrollArea>
        </main>
      </body>
    </html>
  );
}
