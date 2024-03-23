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
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import Modal from "react-modal";
// 1st party
import "@/app/_lib/globals.css";
import { Separator } from "@/app/_components/separator";
import { Button } from "@/app/_components/button";
import { Input } from "@/app/_components/input";
import { Label } from "@/app/_components/label";

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
    linkUrl: "https://github.com/anthonybench",
    imgSource: "/assets/general/github_dark.png",
    imgAlt: "follow me on github",
  },
  {
    id: 2,
    linkUrl: "https://duolingo.com/profile/thesleepyboy",
    imgSource: "/assets/general/duolingo.svg",
    imgAlt: "follow me on duolingo",
  },
  {
    id: 3,
    linkUrl: "https://monkeytype.com/profile/boysleepy",
    imgSource: "/assets/general/monkeytype.png",
    imgAlt: "connect with me on monkeytype",
  },
  // {
  //   id: 4,
  //   linkUrl: "https://linkedin.com/in/anthonybench",
  //   imgSource: "/assets/general/linkedin.png",
  //   imgAlt: "connect with me on linkedin",
  // },
];

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Page() {
  let zoomLevel: number = 1;
  let subtitle: any;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={`flex flex-col leading-7`}>
      <Script src="https://platform.linkedin.com/badges/js/profile.js" />
      {/* 1: Blurb */}
      <p className={`flex`}>
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
      {/* linkedin badge */}
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="medium"
        data-theme="dark"
        data-type="VERTICAL"
        data-vanity="anthonybench"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
        ></a>
      </div>
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="medium"
        data-theme="light"
        data-type="VERTICAL"
        data-vanity="anthonybench"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link"
          href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
        ></a>
      </div>

      {/* 2: Social Links */}
      <div className={`flex justify-center py-5 pt-20`}>
        <div>
          <div className="space-y-1">
            <h4 className="flex justify-center text-sm font-medium leading-none">
              <p>Connect with me!</p>
            </h4>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center justify-center space-x-4 text-sm">
            {socialLinks.map((link) => {
              return (
                <>
                  {link.id !== 1 && <Separator orientation="vertical" />}

                  <Link href={link.linkUrl}>
                    <Image
                      src={link.imgSource}
                      width={40}
                      height={40}
                      alt={link.imgAlt}
                    />
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      </div>
      {/* 3 : Resume */}
      <div className={`grow`}>
        <div className="my-4">
          <Separator />
        </div>
        <div className="">
          <div>
            <div className={`flex justify-center`}>
              <Button variant="secondary" className={``} onClick={openModal}>
                See my resume
              </Button>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div style={{ transform: `scale(${zoomLevel})` }}>
                <iframe
                  src="/assets/general/resume.pdf"
                  width="100%"
                  height="800"
                />
              </div>
            </Modal>
          </div>
          <div className={`flex justify-around px-5`}>
            <div className={``}>
              <Label htmlFor="email_resume">Send resume to your inbox</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  className={``}
                  id="email_resume"
                  type="email"
                  placeholder="Email"
                />
                <Button type="submit">
                  <PaperPlaneIcon />
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Link
                  className={``}
                  href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls"
                >
                  View resume&apos;s{" "}
                  <Image
                    src="/assets/general/latex.svg"
                    width={43}
                    height={43}
                    className="inline"
                    alt="LaTeX logo"
                  />{" "}
                  source.
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
