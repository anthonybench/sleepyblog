import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/lib/globals.css";

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
        

        {children}
      </body>
    </html>
  );
}
