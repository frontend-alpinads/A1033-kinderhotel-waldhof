"use client";

import { useCallback, useState } from "react";
import { HeroV1 } from "./variants/hero-v1";
import { HeroV2 } from "./variants/hero-v2";
import { HeroV3 } from "./variants/hero-v3";
import { HeroV4 } from "./variants/hero-v4";
import { HeroV5 } from "./variants/hero-v5";
import { HeroV6 } from "./variants/hero-v6";
import { HeroV7 } from "./variants/hero-v7";
import { HeroV8 } from "./variants/hero-v8";
import { HeroV9 } from "./variants/hero-v9";
import { HeroV10 } from "./variants/hero-v10";
import { HeroV11 } from "./variants/hero-v11";
import { HeroV12 } from "./variants/hero-v12";
import { HeroV13 } from "./variants/hero-v13";
import { useSectionVariants } from "@/contents";

const heros = {
  v1: HeroV1,
  v2: HeroV2,
  v3: HeroV3,
  v4: HeroV4,
  v5: HeroV5,
  v6: HeroV6,
  v7: HeroV7,
  v8: HeroV8,
  v9: HeroV9,
  v10: HeroV10,
  v11: HeroV11,
  v12: HeroV12,
  v13: HeroV13,
};

export function Hero() {
  const { hero: heroVariant } = useSectionVariants();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<{
    scrollTo: (index: number) => void;
    resetAutoplay: () => void;
  } | null>(null);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      carouselApi?.scrollTo(index);
      carouselApi?.resetAutoplay();
    },
    [carouselApi],
  );

  const HeroImpl = heros[heroVariant as keyof typeof heros];
  if (!HeroImpl) {
    return null;
  }

  return (
    <>
      <div className="">
        <HeroImpl
          selectedIndex={selectedIndex}
          carouselApi={carouselApi}
          onThumbnailClick={handleThumbnailClick}
          onSlideChange={setSelectedIndex}
          onApiReady={setCarouselApi}
        />
      </div>
    </>
  );
}
