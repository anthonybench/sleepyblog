"use client"; // because im calling usePathname()

import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams, usePathname, useRouter } from "next/navigation"; // usePathname forces addition of "use client" directive
import {
  IdentificationIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import "@/app/_lib/globals.css";
import { Separator } from "@/app/_components/separator";
import { dateFormatter } from "@/app/_lib/dateformatter";

const links = [
  { name: "About", href: "/about", icon: IdentificationIcon },
  { name: "Software", href: "/software", icon: CodeBracketIcon },
  { name: "Tutoring", href: "/tutoring", icon: AcademicCapIcon },
  { name: "Furniture", href: "/furniture", icon: WrenchScrewdriverIcon },
];


export default function SideNav({ className }: { className: any }) {
  const pathname = usePathname();
  const lastUpdatedDate = dateFormatter(new Date());

  return (
    <div className={`${className}`}>
      <div
        className={`flex h-screen flex-col items-center justify-between gap-2 pt-10`}
      >
        <div className={`w-full`}>
          <div className={`flex justify-center`}>
            <Link href="/">
              <Image
                src="/img/holo.jpg" // relative to public, starts with '/'
                width={150} // width & height must have an aspect ratio identical to source image
                height={150}
                className=""
                alt="SleepyBoy typing on laptop"
              />
            </Link>
          </div>
          <nav className={`w-full`}>
            {links.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                    {
                      "bg-sky-100 text-blue-600": pathname === link.href,
                    },
                  )}
                >
                  <span className={`pl-4`}></span>
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block pl-1">{link.name}</p>
                </Link>
              );
            })}
          </nav>
        </div>

        <footer>
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Authored by Isaac Yep
            </h4>
            <p className="text-sm text-muted-foreground">
              Last Updated:
              <br />
              {lastUpdatedDate}
            </p>
          </div>
          {/* <Separator className="my-4" /> */}
          <div className="flex h-5 items-center justify-center space-x-4 py-7 text-sm">
            <Link href="https://github.com/anthonybench/sleepyblog/blob/main/README.md">
              <Image
                src="/img/github_dark.png"
                width={40} // width & height must have an aspect ratio identical to source image
                height={40}
                className=""
                alt="see website source"
              />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
