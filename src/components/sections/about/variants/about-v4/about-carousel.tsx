"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AboutCarouselProps {
  slides: ReactNode[];
}

export function AboutCarousel({ slides }: AboutCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    // containScroll: false,
    loop: true,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const frame = requestAnimationFrame(onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden px-4 lg:px-5" ref={emblaRef}>
        <div className="-ml-4 flex lg:-ml-5">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_90%] overflow-hidden pl-4 md:flex-[0_0_60%] lg:flex-[0_0_48rem] lg:pl-5"
            >
              <div
                className={cn(
                  "transition-transform duration-300",
                  selectedIndex === index ? "scale-110" : "",
                )}
              >
                {slide}
              </div>
              <div
                className={cn(
                  "bg-background absolute inset-y-0 left-0 w-0 transition-all duration-300",
                  selectedIndex === index ? "w-5 max-lg:w-3" : "",
                )}
              />
              <div
                className={cn(
                  "bg-background absolute inset-x-0 top-0 h-0 transition-all duration-300 max-lg:hidden",
                  selectedIndex === index ? "" : "h-8",
                )}
              />
              <div
                className={cn(
                  "bg-background absolute inset-x-0 bottom-0 h-0 transition-all duration-300 max-lg:hidden",
                  selectedIndex === index ? "" : "h-8",
                )}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 px-4 pt-8 max-lg:justify-center lg:px-8 lg:pt-10">
        <button
          onClick={scrollPrev}
          className="bg-background border-primary hover:bg-primary/10 flex size-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur-2xl transition-all disabled:pointer-events-none disabled:opacity-50"
          aria-label="Previous slide"
          disabled={!canScrollPrev}
        >
          <CaretLeftIcon className="text-primary size-5" weight="regular" />
        </button>
        <button
          onClick={scrollNext}
          className="bg-primary text-button-foreground hover:bg-primary/90 border-primary flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
          aria-label="Next slide"
          disabled={!canScrollNext}
        >
          <CaretRightIcon className="text-background size-5" weight="regular" />
        </button>
      </div>
    </div>
  );
}
