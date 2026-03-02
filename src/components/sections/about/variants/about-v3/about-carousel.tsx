"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

interface AboutCarouselProps {
  slides: ReactNode[];
}

export function AboutCarousel({ slides }: AboutCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    // containScroll: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    queueMicrotask(onSelect);
    emblaApi.on("select", onSelect);
    return () => {
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
    <div className="absolute inset-0">
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - only visible on lg screens */}
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between lg:inset-x-6 lg:bottom-6">
        <p className="text-background text-xl">
          {(selectedIndex + 1).toString().padStart(2, "0")} /{" "}
          {slides.length.toString().padStart(2, "0")}
        </p>
        <div className="flex gap-4">
          <button
            onClick={scrollPrev}
            className="bg-background/0 hover:bg-background/3 border-background flex size-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xl transition-all disabled:pointer-events-none disabled:opacity-50"
            aria-label={"Previous slide"}
            disabled={!canScrollPrev}
          >
            <CaretLeftIcon
              className="text-background size-5"
              weight="regular"
            />
          </button>
          <button
            onClick={scrollNext}
            className="bg-background hover:bg-background/90 flex size-12 cursor-pointer items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50"
            aria-label={"Next slide"}
            disabled={!canScrollNext}
          >
            <CaretRightIcon className="text-primary size-5" weight="regular" />
          </button>
        </div>
      </div>
    </div>
  );
}
