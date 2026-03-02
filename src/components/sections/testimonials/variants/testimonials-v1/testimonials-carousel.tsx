"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

interface TestimonialsCarouselProps {
  slides: ReactNode[];
}

export function TestimonialsCarousel({ slides }: TestimonialsCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    <div className="relative flex flex-col justify-between lg:h-full">
      <div
        className="overflow-hidden px-4 pb-5 lg:pb-4 lg:pl-10"
        ref={emblaRef}
      >
        <div className="-ml-4 flex lg:-ml-10">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] pl-4 lg:flex-[0_0_95%] lg:pl-10"
            >
              <div
                style={{ opacity: selectedIndex === index ? 1 : 0 }}
                className="transition-opacity duration-300"
              >
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 max-lg:justify-center lg:mt-auto lg:pl-10">
        <button
          onClick={scrollPrev}
          className="bg-primary/0 hover:bg-primary/3 border-primary/30 flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
          aria-label={"Previous slide"}
        >
          <CaretLeftIcon className="text-primary size-5" weight="regular" />
        </button>
        <button
          onClick={scrollNext}
          className="bg-primary hover:bg-primary/90 flex size-12 cursor-pointer items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50"
          aria-label={"Next slide"}
        >
          <CaretRightIcon
            className="text-primary-foreground size-5"
            weight="regular"
          />
        </button>
      </div>
    </div>
  );
}
