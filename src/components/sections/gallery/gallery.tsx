"use client";

import { GalleryV1 } from "./variants/gallery-v1";
import { GalleryV2 } from "./variants/gallery-v2";
import { GalleryV3 } from "./variants/gallery-v3";
import { GalleryV4 } from "./variants/gallery-v4";
import { GalleryV5 } from "./variants/gallery-v5";
import { useSectionVariants } from "@/contents";

const galleries = {
  v1: GalleryV1,
  v2: GalleryV2,
  v3: GalleryV3,
  v4: GalleryV4,
  v5: GalleryV5,
};

export function Gallery() {
  const { gallery: galleryVariant } = useSectionVariants();
  const GalleryImpl = galleries[galleryVariant as keyof typeof galleries];
  if (!GalleryImpl) {
    return null;
  }

  return <GalleryImpl />;
}
