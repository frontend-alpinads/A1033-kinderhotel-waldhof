"use client";

import Image from "next/image";
import { AboutCarousel } from "./about-carousel";
import { useAboutContent } from "@/contents";

export function AboutV3() {
  const about = useAboutContent();
  const titleParts = about.title.split("\n");

  return (
    <section id="about" className="bg-muted">
      <div className="relative mx-auto grid gap-18 pt-20 lg:grid-cols-2 lg:gap-16 lg:px-5 lg:py-30">
        <div className="h-70 w-full max-lg:order-2 lg:h-full lg:min-h-140">
          <div className="relative size-full">
            <AboutCarousel
              slides={about.images.map((src, index) => (
                <div key={index} className="absolute inset-0">
                  <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    fill
                    src={src}
                    alt={`About image ${index + 1}`}
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 48.43%, rgba(0, 0, 0, 0.20) 87.53%)",
                    }}
                  ></div>
                </div>
              ))}
            />
          </div>
        </div>

        <div className="flex flex-col items-start justify-center gap-4 max-lg:order-1 max-lg:px-4 lg:row-start-1">
          <h2 className="text-accent px-3 py-2 text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1">
            - {about.badge} -
          </h2>

          <p className="font-title text-display-2 font-medium">
            {titleParts[0]} {titleParts[1]}
          </p>

          <p className="mx-auto w-full max-w-360 text-base leading-normal -tracking-[1%] opacity-80">
            {about.description}
          </p>
        </div>
      </div>
    </section>
  );
}
