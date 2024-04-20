"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Link from "next/link";
// 1st party
import { comfortaa } from "@/app/_lib/fonts";
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
import { themes } from "@/app/_lib/themes";
import { Theme } from "@/app/_lib/schemas";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
const title = `SleepyBlog`;
interface ThemeProps {
  selectedTheme: Theme;
  onThemeChange: (newTheme: string) => void;
}

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Header({ selectedTheme, onThemeChange }: ThemeProps) {
  return (
    <header className={`m-0 flex h-full items-end justify-between px-3 pr-5`}>
      <Link href="/" className={`${comfortaa.className}`}>
        <h1 className={`text-6xl`}>{title}</h1>
      </Link>

      <div className={`w-1/6`}>
        <Select onValueChange={onThemeChange} defaultValue={themes[0]._name}>
          <SelectTrigger>
            <SelectValue placeholder="Dracula" />
          </SelectTrigger>
          <SelectContent
            defaultChecked
            className={`${selectedTheme.txt.l4} ${selectedTheme.bg.frame}`}
          >
            <SelectGroup defaultValue={themes[0]._name}>
              <SelectLabel>✨Theme✨</SelectLabel>
              {themes.map((theme) => (
                <SelectItem key={theme._name} value={theme._name}>
                  {theme._name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
