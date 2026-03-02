"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRoomsTranslations } from "@/lib/i18n";

interface RoomsCarouselProps {
  slides: ReactNode[];
  activeTab?: string;
}

export function RoomsCarousel({
  slides,
  activeTab = "all",
}: RoomsCarouselProps) {
  const roomsT = useRoomsTranslations();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  // Get the appropriate text based on active tab
  const getViewingText = () => {
    if (activeTab === "zimmer") {
      return roomsT.carousel.viewingTextRooms;
    } else if (activeTab === "chalet") {
      return roomsT.carousel.viewingTextChalets;
    }
    return roomsT.carousel.viewingText;
  };

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
    <div className="relative">
      <div className="overflow-hidden px-4 lg:px-5" ref={emblaRef}>
        <div className="-ml-4 flex lg:-ml-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] pl-4 md:flex-[0_0_50%] lg:pl-6 min-[108rem]:flex-[0_0_33.333%]"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-8 px-4 pt-5 lg:flex-row lg:items-center lg:gap-10 lg:px-8 lg:pt-6">
        <div className="flex w-full justify-between gap-4 lg:items-center lg:gap-10">
          <p className="text-card flex items-center justify-center text-base opacity-80">
            {getViewingText()
              .replace("{current}", String(selectedIndex + 1))
              .replace("{total}", String(slides.length))}
          </p>

          <div className="flex gap-4 lg:order-last">
            <button
              onClick={scrollPrev}
              className="bg-primary/0 hover:bg-primary/3 border-primary/30 flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
              aria-label={roomsT.carousel.previousSlide}
              disabled={!canScrollPrev}
            >
              <CaretLeftIcon className="text-primary size-5" weight="regular" />
            </button>
            <button
              onClick={scrollNext}
              className="bg-primary hover:bg-primary/90 flex size-12 cursor-pointer items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50"
              aria-label={roomsT.carousel.nextSlide}
              disabled={!canScrollNext}
            >
              <CaretRightIcon
                className="text-primary-foreground size-5"
                weight="regular"
              />
            </button>
          </div>

          <div className="bg-primary/50 h-1 w-300 max-lg:hidden lg:order-first lg:flex-1">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${((selectedIndex + 1) / slides.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
