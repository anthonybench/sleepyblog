// "use client"; // because TODO
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
// import {  } from "@/app/_components/TODO";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
export const metadata: Metadata = {
  title: {
    template: "%s | TODO",
    default: "TODO",
  },
  description: "TODO",
  metadataBase: new URL("https://TODO"),
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default async function Page() {
  return (
    <Image
      src="https://i.imgur.com/YVznnbN.png" // relative to public, starts with '/'
      width={100} // width & height must have an aspect ratio identical to source image
      height={100}
      className="inline"
      alt="TODO"
    />
  );
}
