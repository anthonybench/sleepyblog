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
import { useForm } from "react-hook-form";
// 3rd party
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import Modal from "react-modal";
// 1st party
import "@/app/_lib/globals.css";
import EmailSender from "@/app/_components/email-sender";
import { Separator } from "@/app/_components/separator";
import { Button } from "@/app/_components/button";
import { Input } from "@/app/_components/input";
import { Label } from "@/app/_components/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/form";

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
    imgSource: "github_dark.png",
    imgAlt: "follow me on github",
  },
  {
    id: 2,
    linkUrl: "duolingo.com/profile/thesleepyboy",
    imgSource: "duolingo.svg",
    imgAlt: "follow me on duolingo",
  },
  {
    id: 3,
    linkUrl: "monkeytype.com/profile/boysleepy",
    imgSource: "monkeytype.png",
    imgAlt: "see my stats on monkeytype",
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
  let dingus = true; // light or dark linkedin badge

  return (
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
        <div className=" pb-10">
          <div className="">
            <h4 className="flex justify-center text-sm font-medium leading-none">
              {/* Linkedin Badge */}
              <div
                className="badge-base LI-profile-badge pl-10"
                data-locale="en_US"
                data-size="small"
                data-theme={`${dingus ? "light" : "dark"}`}
                data-type="VERTICAL"
                data-vanity="anthonybench"
                data-version="v1"
              >
                <a
                  className="badge-base__link LI-simple-link"
                  href="https://www.linkedin.com/in/anthonybench?trk=profile-badge"
                ></a>
              </div>
            </h4>
          </div>
          <Separator className="my-4" />
          {/* Small Links */}
          <div className="flex h-5 items-center justify-center space-x-4 text-sm">
            {socialLinks.map((link) => {
              return (
                <span key={link.id}>
                  {link.id !== 1 && (
                    <Separator className="" orientation="vertical" />
                  )}
                  <Link href={`https://${link.linkUrl}`}>
                    <Image
                      src={`/assets/general/${link.imgSource}`}
                      width={40}
                      height={40}
                      alt={link.imgAlt}
                      className="inline pt-3"
                    />
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      {/* Resume */}
      <div className={`grow`}>
        <div className="my-4">
          <Separator />
        </div>
        <div>
          <div>
            <div className={`flex justify-center`}>
              <Button variant="secondary" onClick={openModal}>
                See my resume
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
          </div>
          <div className={`flex justify-around px-5`}>
            {/* 🚧 */}
            <EmailSender />
            {/* <div>
              <Label htmlFor="email_resume">Send resume to your inbox</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  id="email_resume"
                  type="email"
                  placeholder="my_inbox@mail.com"
                />
                <Button type="submit">
                  <PaperPlaneIcon />
                </Button>
              </div>
            </div> */}
            {/* 🚧 */}
            <div className="flex items-end">
              <Button variant="outline">
                <Link href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls">
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
