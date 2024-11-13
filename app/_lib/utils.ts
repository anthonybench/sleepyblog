/*
  ISSUE:
    - can't use the fs module in a client component
    - must be some other way to fetch a list of slugs...
    - hard-coded list for now
    - idea; refactor getPostSlugs() as a server action
*/

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { themes } from "@/app/_lib/themes";

const slugs = [
  "2024-02-29",
  "2024-03-10",
  "2024-03-20",
  "2024-04-14",
  "2024-05-10",
  "2024-05-13",
  "2024-05-28",
  "2024-06-24",
  "2024-07-08",
  "2024-07-24",
  "2024-08-11",
  "2024-09-03",
  "2024-09-24",
  "2024-10-13",
  "2024-11-04",
  "2024-11-13",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getOrdinalSuffix(day: number) {
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

export function dateFormatter(dateString: string) {
  // Split the date string into year, month, and day components
  const [yearString, monthString, dayString] = dateString.split("-");

  // Convert year, month, and day to numbers
  const year = parseInt(yearString, 10);
  const month = parseInt(monthString, 10) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(dayString, 10);

  // Create a Date object from the components
  const date = new Date(year, month, day);

  // Use the original dateFormatter logic with the Date object
  const monthName = date.toLocaleString("default", { month: "long" });
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  return `${monthName} ${dayWithSuffix}, ${year}`;
}

export function getThemeByName(name: string) {
  return themes.filter((item) => item._name === name)[0];
}

export function getNextPost(date: string) {
  const index = slugs.indexOf(date);
  if (index == slugs.length - 1) {
    return "none";
  } else {
    return `/posts/${slugs[index + 1].replace(/\.md$/, "")}`;
  }
}

export function getPrevPost(date: string) {
  const index = slugs.indexOf(date);
  if (index == 0) {
    return "none";
  } else {
    return `/posts/${slugs[index - 1].replace(/\.md$/, "")}`;
  }
}

export function getRandomPost() {
  const randomSlug = slugs[Math.floor(Math.random() * slugs.length)].replace(
    /\.md$/,
    "",
  );
  return `/posts/${randomSlug}`;
}
