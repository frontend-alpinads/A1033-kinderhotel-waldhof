"use client";

import Image from "next/image";
import { AboutCarousel } from "./about-carousel";
import { useAboutContent } from "@/contents";

export function AboutV4() {
  const about = useAboutContent();
  const titleParts = about.title.split("\n");

  return (
    <section
      id="about"
      className="bg-background text-foreground relative overflow-hidden py-20 lg:py-30"
    >
      {/* Text Contents */}
      <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-8">
        <h2 className="text-accent py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1">
          - {about.badge} -
        </h2>

        <p className="font-title text-display-2 text-foreground text-center font-medium">
          {titleParts[0]} {titleParts[1]}
        </p>

        <p className="mx-auto w-full max-w-360 text-center text-base leading-normal">
          {about.description}
        </p>
      </div>

      {/* About Carousel */}
      <div className="pt-10 lg:pt-20">
        <AboutCarousel
          slides={about.images.map((src, index) => (
            <div key={index} className="relative aspect-[5/4]">
              <Image
                src={src}
                alt={`About image ${index + 1}`}
                fill
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        />
      </div>
    </section>
  );
}
