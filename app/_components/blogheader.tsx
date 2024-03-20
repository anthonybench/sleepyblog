"use client";
import Image from "next/image";
import { dateFormatter } from "../_lib/dateformatter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

type Props = {
  title: string;
  media: string[];
  date: Date;
};

const isImage = (path: string): boolean => {
  const substrings = [".jpg", ".jpeg", ".png", ".gif"];
  return substrings.some((substring) => path.includes(substring));
};

export function BlogHeader({ title, media, date }: Props) {
  const formattedDate = dateFormatter(date);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
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
                <div className={`flex justify-center`}>
                  {isImage(_) ? (
                    <Image
                      src={_}
                      width={150}
                      height={150}
                      alt="SleepyBoy typing on laptop"
                    />
                  ) : (
                    <video controls width={500} height={500}>
                      <source src={_} />
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
