"use client";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Separator } from "@/app/_components/separator";
import "@/app/_lib/globals.css";
import { useState } from "react";
// import Modal from "@/app/_components/modal";
import Modal from "react-modal";
import React from "react";
import { Button } from "@/app/_components/button";
import { Input } from "@/app/_components/input";
import { Label } from "@/app/_components/label";
import { PaperPlaneIcon, CheckIcon } from "@radix-ui/react-icons";

const customStyles = {
  content: {
    // position: "fixed",
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    // WebkitOverflowScrolling: "touch",
    borderRadius: "3rem",
    outline: "none",
    padding: "2px",
  },
};

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
      {/* 1 : Blurb */}
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

      {/* 2 : Connect with me */}
      <div className={`flex justify-center py-5 pt-20`}>
        <div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Connect with me!
            </h4>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center justify-center space-x-4 text-sm">
            <Link href="https://linkedin.com/in/anthonybench">
              <Image
                src="/img/linkedin.png"
                width={40} // width & height must have an aspect ratio identical to source image
                height={40}
                alt="connect with me on linkedin"
              />
            </Link>
            <Separator orientation="vertical" />
            <Link href="https://github.com/anthonybench">
              <Image
                src="/img/github_dark.png"
                width={40} // width & height must have an aspect ratio identical to source image
                height={40}
                alt="connect with me on github"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 : Resume */}
      <div className={`grow`}>
        <div className="my-4">
          <Separator />
        </div>
        <div className="">
          {/* View my Resume */}
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
                <iframe src="/assets/resume.pdf" width="100%" height="800" />
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
            <Button variant="outline">
              <Link
                className={``}
                href="https://github.com/anthonybench/resume/blob/main/FormatDetails.cls"
              >
                View resume&apos;s{" "}
                <Image
                  src="/img/latex.svg" // relative to public, starts with '/'
                  width={43} // width & height must have an aspect ratio identical to source image
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
  );
}
