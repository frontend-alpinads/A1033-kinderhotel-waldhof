"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import ClassNames from "embla-carousel-class-names";

interface OffersCarouselProps {
  slides: ReactNode[];
}

export function FeaturesCarousel({ slides }: OffersCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScroll, setCanScroll] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      breakpoints: {
        "(max-width: 640px)": {
          containScroll: false,
        },
      },
    },
    [ClassNames()],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScroll(emblaApi.canScrollPrev() || emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    queueMicrotask(onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
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
        <div
          className={`flex ${canScroll ? "ml-0 lg:-ml-6" : "justify-center"}`}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_90%] pl-0 transition-transform duration-300 md:flex-[0_0_50%] lg:flex-[0_0_auto] lg:pl-6 [&:not(.is-snapped)]:scale-[0.9] md:[&:not(.is-snapped)]:scale-100 lg:[&:not(.is-snapped)]:scale-100"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {canScroll && (
        <div className="flex justify-center gap-4 px-5 pt-5 lg:justify-start lg:pt-10">
          <button
            onClick={scrollPrev}
            className="bg-background hover:bg-background/80 border-primary/30 flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
            aria-label={"Previous slide"}
            disabled={!canScrollPrev}
          >
            <CaretLeftIcon className="text-primary size-5" weight="regular" />
          </button>
          <button
            onClick={scrollNext}
            className="bg-primary hover:bg-primary/90 flex size-12 cursor-pointer items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50"
            aria-label={"Next slide"}
            disabled={!canScrollNext}
          >
            <CaretRightIcon
              className="text-primary-foreground size-5"
              weight="regular"
            />
          </button>
        </div>
      )}
    </div>
  );
}
