"use client";

import { StarIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useHeroContent } from "@/contents";

const images = [
  "/placeholder.jpg",
  "/placeholder-2.jpg",
  "/placeholder-3.jpg",
];

export function HeroSocialProof() {
  const hero = useHeroContent();

  return (
    <div className="flex w-full items-center gap-3.5 rounded-none border border-white/10 bg-[#5D5D5D]/40 p-3 backdrop-blur-md lg:w-fit lg:px-2.5 lg:py-2">
      <div className="flex -space-x-2.5">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative size-10 overflow-hidden rounded-full"
          >
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              alt=""
              width={40}
              height={40}
              priority
            />
          </div>
        ))}
      </div>
      <div className="bg-background/10 h-6 w-px"></div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {Array.from({ length: hero.socialProof?.maxRating ?? 5 }).map(
            (_, index) => (
              <StarIcon
                weight="fill"
                key={index}
                className="text-star size-4"
              />
            ),
          )}
        </div>
        {hero.socialProof?.reviewsText && (
          <p className="text-background text-sm leading-[100%]">
            {hero.socialProof.reviewsText.replace(
              "{count}",
              String(hero.socialProof.totalReviews ?? 0),
            )}
          </p>
        )}
      </div>
    </div>
  );
}
