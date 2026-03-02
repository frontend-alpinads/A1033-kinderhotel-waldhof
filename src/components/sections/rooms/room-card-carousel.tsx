"use client";

import Image from "next/image";
import { ReactNode, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRoomsTranslations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type RoomCardCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  children?: ReactNode;
  progressType?: "bar" | "dots";
};

export function RoomCardCarousel({
  images,
  alt,
  className,
  children,
  progressType = "bar",
}: RoomCardCarouselProps) {
  const roomsT = useRoomsTranslations();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    watchDrag: false,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi],
  );

  // If only 1 image, render static Image (no carousel overhead)
  if (images.length <= 1) {
    return (
      <div className={cn("relative", className)}>
        <Image
          fill
          src={images[0]}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {children}
      </div>
    );
  }

  // Multiple images - render full carousel with navigation
  return (
    <div className={cn("group relative", className)}>
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((imageSrc, index) => (
            <div key={index} className="relative h-full w-full flex-[0_0_100%]">
              <Image
                fill
                src={imageSrc}
                alt={`${alt} - ${roomsT.image} ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - always visible on mobile, hover-only on desktop */}
      <button
        onClick={scrollPrev}
        aria-label={roomsT.previousImage}
        className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <CaretLeftIcon className="size-5 text-white" weight="regular" />
        <span className="sr-only">{roomsT.previousImage}</span>
      </button>

      <button
        onClick={scrollNext}
        aria-label={roomsT.nextImage}
        className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <CaretRightIcon className="size-5 text-white" weight="regular" />
        <span className="sr-only">{roomsT.nextImage}</span>
      </button>

      {/* Progress bar */}
      {progressType === "bar" && (
        <div className="absolute bottom-3 left-3 z-10 flex transform">
          <div className="h-1 w-25 flex-1 rounded-full bg-white/50">
            <div
              className="h-1 rounded-full bg-white transition-all duration-300"
              style={{
                width: `${((selectedImageIndex + 1) / images.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {progressType === "dots" && (
        <div className="absolute bottom-3 left-3 z-10 flex transform items-center gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full bg-white transition-all duration-300",
                selectedImageIndex !== index && "w-1.5 opacity-50",
                selectedImageIndex === index && "w-8 opacity-100",
              )}
            ></div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
