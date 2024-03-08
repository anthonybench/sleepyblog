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

const customStyles = {
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '3rem',
    outline: 'none',
    padding: '2px'
  },
};

export default function Page({ className }: { className: string }) {
  let zoomLevel:number = 1;
  let subtitle: any;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={`${className} flex flex-col`}>
      {/* 1 : Blurb */}
      <div className={``}>
        Hi, I'm Isaac 👋
        <br />
        I live at the intersection of data & dev-ops.
        <br />
        I love communicating math, physics and computer science to help empower
        others, and equally as much to learn from them.
        <br />
        A passionate woodworker, skateboarder, and maker of dope pizzas.
        <br /><br />
        Life long engineer, professional kid.
      </div>

      {/* 2 : Connect with me */}
      <div className={`flex justify-center py-5`}>
        <div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Connect with me!
            </h4>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 justify-center items-center space-x-4 text-sm">
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
            <Button variant="outline" ><Link className={``} href="https://github.com/anthonybench/resume/blob/main/README.md">
              View resume's <Image
                src="/img/latex.svg" // relative to public, starts with '/'
                width={43} // width & height must have an aspect ratio identical to source image
                height={43}
                className="inline"
                alt="LaTeX logo"
              /> source.
            </Link></ Button>
            {/* Send my resume to your inbox */}
            <div className={``}>
              <Label htmlFor="email_resume">Send resume to your inbox</Label>
              <Input id="email_resume" type="email" placeholder="Email" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}