"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroSpaSliderProps {
  images: string[];
  children?: React.ReactNode;
}

export function HeroSpaSlider({ images, children }: HeroSpaSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
    },
    [autoplayPlugin.current],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-none lg:h-[560px]">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div
              className="relative h-full min-w-0 flex-[0_0_100%]"
              key={index}
            >
              <Image
                src={src}
                alt="Spa image"
                fill
                className="object-cover"
                priority={index === 0}
                quality={100}
                style={{ objectPosition: "50% 35%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay content (title + form) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="pointer-events-auto">{children}</div>
      </div>

      {/* Vertical thumbnails on desktop */}
      <div className="absolute top-1/2 right-4 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "relative h-20 w-28 overflow-hidden rounded-none border transition",
              selectedIndex === index
                ? "border-background ring-background/40 ring-2"
                : "border-white/20 hover:border-white/40",
            )}
          >
            <Image
              src={src}
              alt="Spa thumb"
              fill
              className="object-cover"
              sizes="112px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
