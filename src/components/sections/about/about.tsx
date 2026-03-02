"use client";

import { AboutV1 } from "./variants/about-v1";
import { AboutV2 } from "./variants/about-v2";
import { useSectionVariants } from "@/contents";
import { AboutV3 } from "./variants/about-v3";
import { AboutV4 } from "./variants/about-v4";

const abouts = {
  v1: AboutV1,
  v2: AboutV2,
  v3: AboutV3,
  v4: AboutV4,
};

export function About() {
  const { about: aboutVariant } = useSectionVariants();
  const AboutImpl = abouts[aboutVariant as keyof typeof abouts];
  if (!AboutImpl) {
    return null;
  }

  return <AboutImpl />;
}
