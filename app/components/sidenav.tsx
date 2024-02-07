'use client'; // because im calling usePathname()

import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'; // usePathname forces addition of "use client" directive
import {
  IdentificationIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import "@/app/lib/globals.css";

const links = [
  { name: 'About', href: '/about', icon: IdentificationIcon },
  { name: 'Software', href: '/software', icon: CodeBracketIcon },
  { name: 'Tutoring', href: '/tutoring', icon: AcademicCapIcon },
  { name: 'Furniture', href: '/furniture', icon: WrenchScrewdriverIcon }
]

function getOrdinalSuffix(day:number) {
  const unitsDigit = day % 10;
  if (unitsDigit === 1 && day !== 11) {
    return "st";
  } else if (unitsDigit === 2 && day !== 12) {
    return "nd";
  } else if (unitsDigit === 3 && day !== 13) {
    return "rd";
  } else {
    return "th";
  }
}

export default function SideNav() {
  const pathname = usePathname();
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const day = today.getDate();
  const year = today.getFullYear();

  // Construct the formatted string with ordinal suffix for the day
  const formattedDate = `${monthName} ${day}${getOrdinalSuffix(day)}, ${year}`;
  return (
    <div className="debug">
      <Image
        src="/holo.jpg" // relative to public, starts with '/'
        width={150} // width & height must have an aspect ratio identical to source image
        height={150}
        className="inline-block"
        alt="Screenshots of the dashboard project showing desktop version"
      />

      <nav>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </nav>

      <footer>
        <p>
          Authored by Isaac Yep<br />
          Last Updated {formattedDate}<br />
          TODO: github icon
        </p>
      </footer>
    </div>
  )
}