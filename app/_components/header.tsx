"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Link from "next/link";
// 1st party
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
} from "@/app/_components/select";
import { ThemeProps } from "@/app/_lib/schemas";
import { themes } from "@/app/_lib/themes";
import { getThemeByName } from "@/app/_lib/utils";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(" ");
// }

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Header({ selectedTheme, onThemeChange }: ThemeProps) {
  return (

    <header className={`flex h-full items-end justify-between px-3 m-0 pr-5`}>

      <Link href="/" className={`${cookie.className}`}>
        <h1 className={`text-6xl`}>SleepyBlog</h1>
      </Link>

      <div className={`w-1/6`}>
        <Select onValueChange={onThemeChange} defaultValue={themes[0].name}>
          <SelectTrigger>
            <SelectValue placeholder="Dracula" />
          </SelectTrigger>
          <SelectContent defaultChecked>
            <SelectGroup defaultValue={themes[0].name}>
              <SelectLabel>Theme</SelectLabel>
              {themes.map((theme) => (
                <SelectItem key={theme.name} value={theme.name}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

    </header>
  );
}
