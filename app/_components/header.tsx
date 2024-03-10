"use client";

import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { cookie } from "@/app/_lib/fonts";
import "@/app/_lib/utils.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/select"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const themes = [
  { id: 1, name: "Dracula" },
  { id: 2, name: "Vanilla" },
  { id: 3, name: "Midnight" },
];

export default function Header({className}:{className: string}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selected, setSelected] = useState(themes[0]);

  return (
    <header className={`${className} flex justify-between items-center`}>
      <Link href="/" className={`${cookie.className}`}>
        <h1 className={`text-6xl`}>SleepyBlog</h1>
      </Link>

      <div className={`w-1/6`}>
        <Select defaultValue={themes[0].id.toString()}>
          <SelectTrigger className="">
            <SelectValue />
          </SelectTrigger>
          <SelectContent defaultChecked>
            <SelectGroup defaultValue="Dracula">
              <SelectLabel>Theme</SelectLabel>
              {themes.map((theme)=>(
                <SelectItem key={theme.id} value={theme.id.toString()}>{theme.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
