"use client";

// next
import Image from "next/image";
// react
import * as React from "react";
// 3rd party
import Autoplay from "embla-carousel-autoplay";
// 1st party
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/carousel";

// params
type Props = {
  title: string;
  media: string[];
  formattedDate: string;
};

const isImage = (path: string): boolean => {
  // .heic not supported by next
  // .mov not supported by imgur
  const substrings = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
  return substrings.some((substring) => path.toLowerCase().includes(substring));
};

// view
export function PostHeader({ title, media, formattedDate }: Props) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );
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
            {media.map((imgurLink, index) => (
              <CarouselItem key={index}>
                <div
                  className={`flex h-full items-center justify-center bg-slate-600`}
                >
                  {isImage(imgurLink) ? (
                    <Image
                      src={imgurLink}
                      width={3024}
                      height={4032}
                      alt="Post Image"
                    />
                  ) : (
                    <video
                      controls
                      width={3024}
                      height={4032}
                      preload="metadata"
                    >
                      <source src={imgurLink} />
                      Your browser does not support the html video element.
                    </video>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black" />
          <CarouselNext className="text-black" />
        </Carousel>
      </div>
      <div className="mx-auto flex max-w-2xl justify-center">
        <div className="mb-6 text-lg">{formattedDate}</div>
      </div>
    </>
  );
}
