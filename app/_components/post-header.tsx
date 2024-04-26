"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import Image from "next/image";
// react
import * as React from "react";
// 3rd party
import Autoplay from "embla-carousel-autoplay";
// 1st party
import { dateFormatter } from "../_lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/carousel";

//───────────────────────────┐
//         Params            │
//───────────────────────────┘
type Props = {
  title: string;
  media: string[];
  date: Date;
};

const isImage = (path: string): boolean => {
  const substrings = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
  return substrings.some((substring) => path.toLowerCase().includes(substring));
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function PostHeader({ title, media, date }: Props) {
  const formattedDate = dateFormatter(date);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  // const year = date.getFullYear().toString().padStart(2, "0").slice(-2); // Ensure two digits
  // const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  // const day = date.getDate().toString().padStart(2, "0");
  // const dateString = `${year}_${month}_${day}`;
  const imagePrefix = `/assets/posts/24-03-18/`;
  console.log(imagePrefix);
  return (
    <>
      <h1 className={`text-4xl`}>{title}</h1>
      <div className={`flex justify-center py-5`}>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {media.map((relPath, index) => (
              <CarouselItem key={index}>
                <div
                  className={`flex h-full items-center justify-center bg-slate-600`}
                >
                  {isImage(`${imagePrefix}${relPath}`) ? (
                    <Image
                      src={`${imagePrefix}${relPath}`}
                      width={250}
                      height={100}
                      alt="Post Image"
                    />
                  ) : (
                    <video controls width={500} height={500} preload="metadata">
                      <source src={`${imagePrefix}${relPath}`} />
                      Your browser does not support the html video element.
                    </video>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black" />
          <CarouselNext className="text-black"  />
        </Carousel>
      </div>
      <div className="mx-auto flex max-w-2xl justify-center">
        <div className="mb-6 text-lg">{formattedDate}</div>
      </div>
    </>
  );
}
