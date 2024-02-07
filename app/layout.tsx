import type { Metadata } from "next";
import { inter, jetbrains_mono, fira_code, roboto_mono } from "@/app/lib/fonts";
import "@/app/lib/globals.css";
import Header from "@/app/components/header";
import SideNav from "@/app/components/sidenav";
import SideNaveZero from "@/app/components/sidenavzero";
import Frame from "@/app/components/frame";


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
      <body className={jetbrains_mono.className}>
        {/* <SideNav /> */}
        <SideNaveZero />
        <Header />
        {/* <Frame /> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
