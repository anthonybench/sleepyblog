import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/lib/globals.css";
import Header from "@/app/components/header";
import SideNav from "@/app/components/sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SleepyBlog",
  description: "A blog so sleepy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header><Header /></header>
        <nav><SideNav /></nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
