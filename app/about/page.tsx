"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
// react
import React from "react";
// 3rd party
import Modal from "react-modal";
// 1st party
import EmailSender from "@/app/_components/email-sender";
import { Separator } from "@/app/_components/separator";
import { Button } from "@/app/_components/button";
import { ThemeContext } from "../_lib/themes";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
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

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Page() {
  let zoomLevel: number = 1;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <div className={`flex flex-col leading-7`}>
          <Script src="https://platform.linkedin.com/badges/js/profile.js" />

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
            <div className="pb-10">
              <div className="flex">
                <span className="flex">
                  {/* Linkedin Badge */}
                  <div
                    className="badge-base LI-profile-badge"
                    data-locale="en_US"
                    data-size="medium"
                    data-theme={`${selectedTheme._light ? "light" : "dark"}`}
                    data-type="HORIZONTAL"
                    data-vanity="anthonybench"
                    data-version="v1"
                  >
                    <a
                      className="badge-base__link LI-simple-link"
                      href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
                    ></a>
                  </div>
                  {/* Small Links */}
                  <Separator className="mr-5" orientation="vertical" />
                  <div className="flex flex-col justify-center space-y-3 text-sm">
                    {socialLinks.map((link) => {
                      return (
                        <span className="" key={link.id}>
                          {link.id !== 1 && <Separator className="mb-3" />}
                          <Link href={`https://${link.linkUrl}`}>
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
            <div className="my-4">
              <Separator />
            </div>
            <div className="">
              {/* Send Resume */}
              <div className="flex justify-center">
                <EmailSender />
              </div>
              {/* View Resume */}
              <div className={`flex justify-around px-5`}>
                <div className={`flex justify-center`}>
                  <Button
                    className={`${selectedTheme.bg.button}`}
                    variant="secondary"
                    onClick={openModal}
                  >
                    View resume
                  </Button>
                </div>
                <Modal
                  isOpen={modalIsOpen}
                  // onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div style={{ transform: `scale(${zoomLevel})` }}>
                    <iframe
                      src="/assets/general/Isaac_Yep_Resume.pdf"
                      width="100%"
                      height="800"
                    />
                  </div>
                </Modal>
                {/* View Resume LaTeX */}
                <div className={`flex items-end`}>
                  <Button
                    className={`${selectedTheme.bg.button}`}
                    variant="secondary"
                  >
                    <Link href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls">
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
