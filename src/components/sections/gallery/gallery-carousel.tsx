"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { GalleryCta } from "./gallery-cta";

type GalleryCarouselProps = {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  initialSlide?: number;
  onClose?: () => void;
};

export function GalleryCarousel({
  images,
  initialSlide = 0,
  onClose,
}: GalleryCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialSlide);

  // Main carousel for large images
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
    startIndex: initialSlide,
  });

  // Thumbnail carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const onMainSelect = useCallback(() => {
    if (!emblaMainApi) return;
    const selectedIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(selectedIndex);

    // Sync thumbnail carousel
    if (emblaThumbsApi) {
      emblaThumbsApi.scrollTo(selectedIndex);
    }
  }, [emblaMainApi, emblaThumbsApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi],
  );

  const scrollPrev = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;

    queueMicrotask(onMainSelect);
    emblaMainApi.on("select", onMainSelect);
    emblaMainApi.on("reInit", onMainSelect);

    return () => {
      emblaMainApi.off("select", onMainSelect);
      emblaMainApi.off("reInit", onMainSelect);
    };
  }, [emblaMainApi, onMainSelect]);

  // Sync with initial slide
  useEffect(() => {
    if (emblaMainApi && initialSlide >= 0) {
      emblaMainApi.scrollTo(initialSlide);
    }
  }, [emblaMainApi, initialSlide]);

  if (!images.length) return null;

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col p-4">
        {/* Main Carousel */}
        <div className="relative mb-4 flex flex-1 overflow-hidden">
          <div className="h-full flex-1 overflow-hidden" ref={emblaMainRef}>
            <div className="flex h-full">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex min-w-0 flex-[0_0_100%] items-center justify-center"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      priority={index === initialSlide}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation and Thumbnails */}
        <div className="flex shrink-0 flex-col gap-6">
          {/* Thumbnail Carousel */}
          <div className="w-full overflow-hidden" ref={emblaThumbsRef}>
            <div className="flex gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`relative size-[100px] flex-[0_0_auto] cursor-pointer overflow-hidden transition-all duration-300 ${
                    index === selectedIndex
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-70"
                  }`}
                  onClick={() => onThumbClick(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                  {/* Dark overlay for selected thumbnail */}
                  {index === selectedIndex && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-11">
            {/* Previous Button */}
            <button
              onClick={scrollPrev}
              className="border-primary bg-primary/0 hover:bg-primary/5 flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
              aria-label="Previous slide"
            >
              <CaretLeftIcon className="text-primary size-6" weight="regular" />
            </button>

            {/* Page Counter */}
            <div className="text-base font-normal">
              {selectedIndex + 1}/{images.length}
            </div>

            {/* Next Button */}
            <button
              onClick={scrollNext}
              className="bg-primary hover:bg-primary/90 flex size-12 cursor-pointer items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-50"
              aria-label="Next slide"
            >
              <CaretRightIcon
                className="text-background size-6"
                weight="regular"
              />
            </button>
          </div>
        </div>
      </div>
      <GalleryCta className="sticky bottom-0 lg:hidden" onClose={onClose} />
    </div>
  );
}
