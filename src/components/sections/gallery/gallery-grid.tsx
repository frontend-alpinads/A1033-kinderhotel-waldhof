"use client";

import Image from "next/image";
import { GalleryCta } from "./gallery-cta";

type GalleryGridProps = {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  onImageClick: (index: number) => void;
  onClose?: () => void;
};

// In the repeating 14-image pattern, the 6th and 11th images span 2 rows
const isTallImage = (index: number) => {
  const positionInCycle = index % 14;
  return positionInCycle === 5 || positionInCycle === 10;
};

export function GalleryGrid({ images, onImageClick, onClose }: GalleryGridProps) {
  if (!images.length) return null;

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 lg:auto-rows-[1fr] lg:grid-cols-4">
          {images.map((image, index) => {
            const isTall = isTallImage(index);
            return (
              <button
                key={index}
                type="button"
                className={`group focus-visible:ring-secondary relative cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 ${
                  isTall ? "row-span-2 h-full" : "aspect-square max-lg:aspect-4/3"
                }`}
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>
            );
          })}
        </div>
      </div>
      <GalleryCta className="sticky bottom-0 lg:hidden" onClose={onClose} />
    </div>
  );
}
