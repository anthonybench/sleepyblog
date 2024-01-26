import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Page() {
  return (
    <>
      <p>
        Hello! I'm Isaac 👋<br />
        I live at the intersection of data & dev-ops.<br />
        I love communicating math, physics and computer science to help empower others, and equally as much to learn from them.<br />
        A passionate woodworker, skateboarder, and shredder of maker of dope pizzas.<br /><br />
        Life long engineer, professional kid.
      </p>

      <span>
        TODO: linkedin & github
        {/* <Link><Image /></Link> (linkedin) */}
        {/* <Link><Image /></Link> (github) */}
      </span>

      <p>
      👉 View my resume TODO {/* TODO: resume modal with download link */}
      </p>
    </>
  );
}