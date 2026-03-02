"use client";

import { FeaturesV1 } from "./variants/feature-v1";
import { FeaturesV2 } from "./variants/feature-v2";
import { FeaturesV3 } from "./variants/feature-v3";
import { FeaturesV4 } from "./variants/feature-v4";
import { useSectionVariants } from "@/contents";

const features = {
  v1: FeaturesV1,
  v2: FeaturesV2,
  v3: FeaturesV3,
  v4: FeaturesV4,
};

export function Features() {
  const { features: featuresVariant } = useSectionVariants();
  const FeaturesImpl = features[featuresVariant as keyof typeof features];
  if (!FeaturesImpl) {
    return null;
  }

  return <FeaturesImpl />;
}
