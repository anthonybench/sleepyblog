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
  const substrings = [".jpg", ".jpeg", ".png", ".gif"];
  return substrings.some((substring) => path.includes(substring));
};

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export function BlogHeader({ title, media, date }: Props) {
  const formattedDate = dateFormatter(date);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  const year = date.getFullYear().toString().padStart(2, '0').slice(-2); // Ensure two digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const dateString = `${year}_${month}_${day}`;
  const imagePrefix = `/assets/posts/${dateString}`;
  return (
    <>
      <h1 className={`text-4xl`}>{title}</h1>
      <div className={`flex justify-center`}>
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
            {media.map((_, index) => (
              <CarouselItem key={index}>
                <div className={`flex justify-center items-center h-full bg-slate-600`}> 
                  {isImage(`${imagePrefix}${_}`) ? (
                    <Image
                      src={`${imagePrefix}${_}`}
                      width={150}
                      height={150}
                      alt="SleepyBoy typing on laptop"
                    />
                  ) : (
                    <video controls width={500} height={500}>
                      <source src={`${imagePrefix}${_}`} />
                    </video>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-lg">{formattedDate}</div>
      </div>
    </>
  );
}
