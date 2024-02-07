import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: {
    template: '%s | SleepyBlog',
    default: 'Acme Dashboard',
  },
  description: "A blog so sleepy.",
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function Page({
  params
}:{
  params:{id:number}
}) {
  return (
    <>
      TODO: blog view ({params.id})
    </>
  );
}
