// "use client"; // because TODO
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
// 1st party
import { ThemeContext } from "@/app/_lib/themes";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function GithubLogo() {
  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <Image
          src={`/assets/general/github_${selectedTheme._light ? "dark" : "light"}.png`}
          width={40}
          height={40}
          className=""
          alt="see website source"
        />
      )}
    </ThemeContext.Consumer>
  );
}
