import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

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
