"use client"; // because im calling usePathname()
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// 3rd party
import {
  IdentificationIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
// 1st party
import "@/app/_lib/globals.css";
import { dateFormatter } from "@/app/_lib/utils";
import { lastUpdatedDate } from "@/app/last-updated-date";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
const links = [
  { name: "About", href: "/about", icon: IdentificationIcon },
  { name: "Software", href: "/software", icon: CodeBracketIcon },
  { name: "Tutoring", href: "/tutoring", icon: AcademicCapIcon },
  { name: "Furniture", href: "/furniture", icon: WrenchScrewdriverIcon },
];

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function SideNav() {
  const pathname = usePathname();
  const formatedDate = dateFormatter(
    new Date(
      lastUpdatedDate.year,
      lastUpdatedDate.month - 1,
      lastUpdatedDate.day,
    ) as Date,
  );

  return (
    <div
      className={`flex h-screen flex-col items-center justify-between gap-2`}
    >
      <div className={`w-full`}>
        <div className={`flex justify-center`}>
          <Link href="/">
            <Image
              src="/assets/general/sleepyboy_technologist_cropped_mid.png"
              width={1000}
              height={1000}
              className={``}
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
                <p className="hidden pl-1 md:block">{link.name}</p>
              </Link>
            );
          })}
        </nav>
      </div>

      <footer className="mx-3">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">
            Authored by Isaac Yep
          </h4>
          <p className="text-sm text-muted-foreground">
            Last Updated:
            <br />
            <em>{formatedDate}</em>
          </p>
        </div>
        <div className="flex h-5 items-center justify-center space-x-4 py-7 text-sm">
          <Link href="https://github.com/anthonybench/sleepyblog/blob/main/README.md">
            <Image
              src="/assets/general/github_dark.png"
              width={40}
              height={40}
              className=""
              alt="see website source"
            />
          </Link>
        </div>
      </footer>
    </div>
  );
}
