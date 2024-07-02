// next
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
// import {  } from "@/app/_components/TODO";

// params
export const metadata: Metadata = {
  title: {
    template: "%s | TODO",
    default: "TODO",
  },
  description: "TODO",
  metadataBase: new URL("https://TODO"),
};

// view
export default async function Page() {
  return (
    <div>
      <Image
        src={`https://i.imgur.com/pnXnwRK.jpg`}
        width={3024}
        height={4032}
        alt="Post Image"
      />
      <video controls width={3024} height={4032} preload="metadata">
        <source src={`https://i.imgur.com/n9TgKNN.mp4`} />
        Your browser does not support the html video element.
      </video>
    </div>
  );
}
