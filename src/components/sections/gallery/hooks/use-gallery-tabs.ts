"use client";

import { useCallback, useState } from "react";
import { useGalleryContent } from "@/contents";
import type { GalleryImageContent } from "@/contents/types";

export type TabValue = "all" | "apartments-suites" | "wellness" | "cuisine" | "experiences";

export interface Tab {
  label: string;
  value: string;
}

interface UseGalleryTabsOptions {
  /** Number of images to show per category when "all" tab is active */
  imagesPerCategory?: [number, number, number, number];
}

export function useGalleryTabs(options: UseGalleryTabsOptions = {}) {
  const gallery = useGalleryContent();
  const images = gallery.images;

  const tabs: Tab[] = [
    { label: gallery.tabs.all, value: "all" },
    {
      label: gallery.tabs["apartments-suites"],
      value: gallery.categories["apartments-suites"],
    },
    {
      label: gallery.tabs.wellness,
      value: gallery.categories.wellness,
    },
    {
      label: gallery.tabs.cuisine,
      value: gallery.categories.cuisine,
    },
    {
      label: gallery.tabs.experiences,
      value: gallery.categories.experiences,
    },
  ];

  const [activeTab, setActiveTabState] = useState<TabValue>("all");

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab as TabValue);
  }, []);

  // Get filtered images based on active tab
  const getFilteredImages = (): {
    desktop: GalleryImageContent[];
    mobile: GalleryImageContent[];
  } => {
    if (activeTab !== "all") {
      const filtered = images.filter((image) => image.category === activeTab);
      return { desktop: filtered, mobile: filtered };
    }

    // For "all" tab, use curated highlightImages
    const desktopImages = gallery.highlightImages.desktop
      .map((src) => images.find((img) => img.src === src))
      .filter((img): img is GalleryImageContent => img !== undefined);

    const mobileImages = gallery.highlightImages.mobile
      .map((src) => images.find((img) => img.src === src))
      .filter((img): img is GalleryImageContent => img !== undefined);

    return { desktop: desktopImages, mobile: mobileImages };
  };

  const { desktop: desktopImages, mobile: mobileImages } = getFilteredImages();

  // For backward compatibility, filteredImages returns desktop images
  const filteredImages = desktopImages;

  return {
    tabs,
    activeTab,
    setActiveTab,
    filteredImages,
    desktopImages,
    mobileImages,
    allImages: images,
    gallery,
  };
}
