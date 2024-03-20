//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
// 1st party
import "@/app/_lib/globals.css";
import "@/app/_lib/utils.css";
import { jetbrains_mono } from "@/app/_lib/fonts";
import Header from "@/app/_components/header";
import { ScrollArea } from "@/app/_components/scroll-area";
import SideNav from "@/app/_components/side-nav";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "a blog most sleepy",
  metadataBase: new URL("http://sleepyblog.org"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrains_mono.className} grid h-screen grid-cols-12 grid-rows-12`}
      >
        <div className={`col-span-2 row-span-12`}>
          <SideNav />
        </div>
        <div className={`col-span-10 row-span-1 px-5`}>
          <Header />
        </div>
        <main className={`col-span-10 row-span-11`}>
          <ScrollArea className="h-full rounded-md border p-10">
            {children}
          </ScrollArea>
        </main>
      </body>
    </html>
  );
}
