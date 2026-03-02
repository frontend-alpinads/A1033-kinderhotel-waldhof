"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAboutContent } from "@/contents";
import { hotelProfile } from "@/hotel-config";

export function AboutV2() {
  const about = useAboutContent();
  const titleParts = about.title.split("\n");
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const root = sectionRef.current ?? document;
        const triggers = root.querySelectorAll<HTMLElement>(
          '[data-parallax="trigger"]',
        );
        triggers.forEach((trigger) => {
          const target =
            (trigger.querySelector(
              '[data-parallax="target"]',
            ) as HTMLElement) || trigger;
          const direction =
            trigger.getAttribute("data-parallax-direction") || "vertical";
          const prop = direction === "horizontal" ? "x" : "y";
          const scrubAttr = trigger.getAttribute("data-parallax-scrub");
          const scrub = scrubAttr
            ? scrubAttr === "true"
              ? true
              : Number(scrubAttr)
            : true;
          const startAttr = trigger.getAttribute("data-parallax-start");
          const endAttr = trigger.getAttribute("data-parallax-end");
          const startVal = startAttr !== null ? parseFloat(startAttr) : 0;
          const endVal = endAttr !== null ? parseFloat(endAttr) : -60;
          const scrollStartRaw =
            trigger.getAttribute("data-parallax-scroll-start") || "top bottom";
          const scrollEndRaw =
            trigger.getAttribute("data-parallax-scroll-end") || "bottom top";

          gsap.fromTo(
            target,
            { [prop]: startVal },
            {
              [prop]: endVal,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: scrollStartRaw,
                end: scrollEndRaw,
                scrub,
              },
            },
          );
        });
        ScrollTrigger.refresh();
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      mm.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-background text-foreground relative overflow-hidden py-20 lg:py-30"
    >
      {/* Text Contents */}
      <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-8">
        <h2 className="text-accent px-3 py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1">
          - {about.badge} -
        </h2>

        <p className="font-title text-display-2 text-center font-medium">
          {titleParts[0]} {titleParts[1]}
        </p>

        <p className="text-foreground mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%]">
          {about.description}
        </p>
      </div>

      <div className="pt-10 lg:pt-20">
        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Mobile: 3 images layout (1 tall left, 2 stacked right) */}
          <div className="grid h-96 w-full grid-cols-2 gap-3.5 px-4 lg:hidden">
            <div className="relative overflow-hidden">
              <Image
                alt={hotelProfile.hotelName}
                src={about.images[2]}
                fill
                className="object-cover object-[90%_50%]"
                sizes="90vw"
              />
            </div>
            <div className="grid grid-rows-2 gap-3.5">
              <div className="relative overflow-hidden">
                <Image
                  alt={hotelProfile.hotelName}
                  src={about.images[0]}
                  fill
                  className="object-cover"
                  sizes="90vw"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  alt={hotelProfile.hotelName}
                  src={about.images[1]}
                  fill
                  className="object-cover"
                  sizes="90vw"
                />
              </div>
            </div>
          </div>

          {/* Desktop: two-image layout with subtle parallax */}
          <div className="mt-50 hidden w-full grid-cols-[3fr_2fr] gap-5 px-4 lg:grid lg:h-168 lg:px-8">
            <div
              data-parallax="trigger"
              data-parallax-start="0"
              data-parallax-end="-180"
              data-parallax-scrub="1.2"
              className="relative h-full overflow-hidden"
            >
              <Image
                alt="About large"
                src={about.images[0]}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
            <div
              data-parallax="trigger"
              data-parallax-start="0"
              data-parallax-end="-90"
              data-parallax-scrub="1"
              className="relative mb-8 h-[78%] self-end overflow-hidden lg:mb-60"
            >
              <Image
                alt="About secondary"
                src={about.images[1]}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
