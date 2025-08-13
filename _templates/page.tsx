import type { Metadata } from "next";
import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../_lib/utils/themeContext";

export const metadata: Metadata = {
    title: "Page Title - SleepyBlog",
    description: "Page description for SEO",
};

/**
 * Template for creating new pages
 * Replace this JSDoc comment with a description of what this page does
 */
export default function TemplatePage(): JSX.Element {
    return <div>TODO</div>;
}
