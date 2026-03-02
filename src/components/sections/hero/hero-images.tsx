"use client";

import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";

interface HeroImagesProps {
  images: string[];
  onSlideChange?: (index: number) => void;
  onApiReady?: (api: {
    scrollTo: (index: number) => void;
    resetAutoplay: () => void;
  }) => void;
  autoplayDelay?: number;
}

export function HeroImages({
  images,
  onSlideChange,
  onApiReady,
  autoplayDelay = 4000,
}: HeroImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
    },
    [Fade(), autoplayPlugin.current],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex((prev) => (prev === index ? prev : index));
    onSlideChange?.(index);
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    // Expose scrollTo and resetAutoplay methods to parent
    onApiReady?.({
      scrollTo: (index: number) => emblaApi.scrollTo(index),
      resetAutoplay: () => autoplayPlugin.current.reset(),
    });

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, onApiReady]);

  return (
    <div className="absolute inset-0" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((src, index) => (
          <div className="relative h-full min-w-0 flex-[0_0_100%]" key={index}>
            <Image
              src={src}
              alt={`Hero background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
