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

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const themes = [
  // first is default
  { id: 1, name: "Dracula" },
  { id: 2, name: "Vanilla" },
  { id: 3, name: "Midnight" },
];

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Header({ selectedTheme, onThemeChange }: ThemeProps) {
  return (
    <header className={`flex h-full items-center justify-between px-3`}>
      <Link href="/" className={`${cookie.className}`}>
        <h1 className={`text-6xl`}>SleepyBlog</h1>
      </Link>
      <div className={`w-1/6`}>
        <Select
          onValueChange={onThemeChange}
          defaultValue={themes[0].name.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dracula" />
          </SelectTrigger>
          <SelectContent defaultChecked>
            <SelectGroup>
              <SelectLabel>Theme</SelectLabel>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.name.toString()}>
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
