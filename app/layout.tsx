import type { Metadata } from "next";
import { jetbrains_mono } from "@/app/_lib/fonts";
import "@/app/_lib/globals.css";
import "@/app/_lib/utils.css";
import Header from "@/app/_components/header";
import SideNav from "@/app/_components/sidenav";
import { ScrollArea } from "@/app/_components/scroll-area"


export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "A blog so sleepy",
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'), // TODO: what is a metadataBase
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains_mono.className} grid h-screen grid-cols-12 grid-rows-12`}>
        <div className={`col-span-2 row-span-12`}>
          <SideNav />
        </div>
        <div className={`col-span-10 row-span-1 px-5`}>
            <Header />
        </div>
        <main className={`col-span-10 row-span-11`}>
          <ScrollArea className="h-full rounded-md p-10 border">
            {children}
          </ScrollArea>
        </main>
      </body>
    </html>
  );
}
