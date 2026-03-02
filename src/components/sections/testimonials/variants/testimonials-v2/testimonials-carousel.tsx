"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TestimonialsCarouselProps {
  slides: ReactNode[];
}

export function TestimonialsCarousel({ slides }: TestimonialsCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
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
    <div className="relative">
      <div className="overflow-hidden px-4 lg:px-20" ref={emblaRef}>
        <div className="-ml-4 flex items-center lg:ml-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] pl-4 lg:flex-[0_0_60%] lg:pl-0"
            >
              <div
                className={cn(
                  "transition-all delay-50 duration-400",
                  // selectedIndex === index
                  //   ? "bg-primary text-primary-foreground"
                  "bg-background text-foreground",
                )}
                style={
                  {
                    transform:
                      selectedIndex === index ? "scale(1)" : "scale(0.9)",
                  } as CSSProperties
                }
              >
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={scrollPrev}
          className="bg-primary/0 hover:bg-primary/3 border-primary/30 flex size-12 cursor-pointer items-center justify-center rounded-full border transition-all disabled:pointer-events-none disabled:opacity-50"
          aria-label={"Previous slide"}
        >
          <CaretLeftIcon className="size-5" weight="regular" />
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
