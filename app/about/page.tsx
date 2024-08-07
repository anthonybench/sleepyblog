"use client";

// next
import Image from "next/image";
import Link from "next/link";
// react
import React from "react";
// 1st party
import EmailSender from "@/app/_components/email-sender";
import { Separator } from "@/app/_components/separator";
import { Button } from "@/app/_components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/dialog";
import {
  LinkedInBadgeLight,
  LinkedInBadgeDark,
} from "@/app/_components/linkedin-badge";
import { ThemeContext } from "../_lib/themes";

// params
const customStyles = {
  // resume modal styles
  content: {
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    borderRadius: "3rem",
    outline: "none",
    padding: "2px",
  },
};
const socialLinks = [
  {
    id: 1,
    linkUrl: "github.com/anthonybench",
    imgSource: "github_?.png", // ? will be substituted with light or dark, per theme context
    imgAlt: "follow me on github",
  },
  {
    id: 2,
    linkUrl: "duolingo.com/profile/thesleepyboy",
    imgSource: "duolingo.svg",
    imgAlt: "follow me on duolingo",
  },
  {
    id: 4,
    linkUrl: "pypi.org/user/sleepyboy",
    imgSource: "pypi.png",
    imgAlt: "view my pypi projects",
  },
  {
    id: 5,
    linkUrl: "hub.docker.com/u/sleepyboy",
    imgSource: "docker.png",
    imgAlt: "view my dockerhub projects",
  },
];
function replaceQuestionMark(str: string, replacement: string): string {
  const questionMarkIndex = str.indexOf("?");
  if (questionMarkIndex === -1) {
    return str;
  }
  const trimmedReplacement = replacement.trim();
  return `${str.slice(0, questionMarkIndex)}${trimmedReplacement}${str.slice(questionMarkIndex + 1)}`;
}
// let zoomLevel: number = 1;

// view
export default function Page() {
  // const [modalIsOpen, setIsOpen] = React.useState(false);

  // function openModal() {
  //   setIsOpen(true);
  // }
  // function closeModal() {
  //   setIsOpen(false);
  // }

  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <div className={`flex flex-col leading-7`}>
          {/* Blurb */}
          <p>
            Hi, I&apos;m Isaac 👋
            <br />
            I live at the intersection of dev-ops & data.
            <br />
            I deeply admire simplicity.
            <br />
            An Alaskan who loves the pacific northwest.
            <br />
            Passionate woodworker, skateboarder, and shredder of beat saber.
            <br />
            <br />
            Life long engineer, professional kid.
          </p>

          {/* Social Links */}
          <div className={`pt-15 flex justify-start py-5`}>
            <div className="pb-4">
              <div className="flex">
                <span className="flex">
                  {/* Linkedin Badge */}
                  <div className={`${selectedTheme._light ? "" : "hidden"}`}>
                    <LinkedInBadgeLight />
                  </div>
                  <div className={`${selectedTheme._light ? "hidden" : ""}`}>
                    <LinkedInBadgeDark />
                  </div>
                  {/* Small Links */}
                  <Separator
                    className={`mr-5 ${selectedTheme.pkg.separator} `}
                    orientation="vertical"
                  />
                  <div className="flex flex-col justify-center space-y-3 text-sm">
                    {socialLinks.map((link) => {
                      return (
                        <span className="" key={link.id}>
                          {link.id !== 1 && (
                            <Separator
                              className={`mb-3 ${selectedTheme.pkg.separator}`}
                            />
                          )}
                          <Link
                            href={`https://${link.linkUrl}`}
                            target="_blank"
                          >
                            <Image
                              src={`/assets/general/${link.imgSource.includes("?") ? replaceQuestionMark(link.imgSource, `${selectedTheme._light ? "dark" : "light"}`) : link.imgSource}`}
                              width={40}
                              height={40}
                              alt={link.imgAlt}
                            />
                          </Link>
                        </span>
                      );
                    })}
                  </div>
                </span>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className={`grow`}>
            <div className="mb-4">
              <Separator className={`${selectedTheme.pkg.separator}`} />
            </div>
            <div className="">
              {/* Send Resume */}
              <div className="flex justify-center pt-5">
                <EmailSender />
              </div>
              {/* View Resume */}
              <div className={`flex justify-around px-5`}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className={`${selectedTheme.pkg.button}`}
                      variant="outline"
                    >
                      View resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>My Personal Resume</DialogTitle>
                      <DialogDescription>
                        Looking forward to speaking with you 😊
                      </DialogDescription>
                    </DialogHeader>
                    <iframe
                      // src="https://drive.google.com/file/d/1fbPFcrU4HxJncU1LTybBC_la_CTTdn1v/view?usp=sharing" //TODO: doesn't work, but i want it to...
                      src="/assets/general/Isaac_Yep_Resume.pdf"
                      width="100%"
                      height="600rem"
                    />
                    <DialogFooter>
                      <Link
                        href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls"
                        target="_blank"
                      >
                        👉{" "}
                        <em>
                          View resume&apos;s{" "}
                          <Image
                            src="/assets/general/latex_dark.svg"
                            width={43}
                            height={43}
                            className="inline"
                            alt="LaTeX logo"
                          />{" "}
                          source
                        </em>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* View Resume LaTeX */}
                <div className={`flex items-end`}>
                  <Button
                    className={`${selectedTheme.pkg.button}`}
                    variant="outline"
                  >
                    <Link
                      href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls"
                      target="_blank"
                    >
                      View resume&apos;s{" "}
                      <Image
                        src={`/assets/general/latex_${selectedTheme._light ? "dark" : "light"}.svg`}
                        width={43}
                        height={43}
                        className="inline"
                        alt="LaTeX logo"
                      />{" "}
                      source
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
