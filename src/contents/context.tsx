"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import type { SiteVersion } from "@/lib/i18n/routing";
import type { SiteContents, SectionVariants, SectionVariantsArray, SectionKey } from "./types";

interface ContentsContextValue {
  version: SiteVersion;
  locale: Locale;
  contents: SiteContents;
  sectionVariants: SectionVariants;
  sectionVariantsArray: SectionVariantsArray;
}

const ContentsContext = createContext<ContentsContextValue | null>(null);

// Convert array format to object format for backward compatibility
function arrayToObject(
  array: SectionVariantsArray
): SectionVariants {
  const result: Partial<SectionVariants> = {};
  for (const entry of array) {
    const key = Object.keys(entry)[0] as SectionKey;
    const value = entry[key];
    result[key] = value;
  }
  // Fill in missing keys with false
  const allKeys: SectionKey[] = [
    "hero",
    "about",
    "features",
    "gallery",
    "enquiry",
    "testimonials",
    "faqs",
    "offers",
    "rooms",
    "footer",
  ];
  for (const key of allKeys) {
    if (!(key in result)) {
      result[key] = false;
    }
  }
  return result as SectionVariants;
}

export function ContentsProvider({
  version,
  locale,
  contents,
  sectionVariants: sectionVariantsArray,
  children,
}: {
  version: SiteVersion;
  locale: Locale;
  contents: SiteContents;
  sectionVariants: SectionVariantsArray;
  children: React.ReactNode;
}) {
  const sectionVariants = useMemo(
    () => arrayToObject(sectionVariantsArray),
    [sectionVariantsArray]
  );

  return (
    <ContentsContext.Provider
      value={{
        version,
        locale,
        contents,
        sectionVariants,
        sectionVariantsArray,
      }}
    >
      {children}
    </ContentsContext.Provider>
  );
}

export function useContents() {
  const ctx = useContext(ContentsContext);
  if (!ctx) {
    throw new Error("useContents must be used within a ContentsProvider");
  }
  return ctx;
}

export function useHeroContent() {
  return useContents().contents.hero;
}

export function useAboutContent() {
  return useContents().contents.about;
}

export function useFeaturesContent() {
  return useContents().contents.features;
}

export function useGalleryContent() {
  return useContents().contents.gallery;
}

export function useEnquiryContent() {
  return useContents().contents.enquiry;
}

export function useTestimonialsContent() {
  return useContents().contents.testimonials;
}

export function useFaqsContent() {
  return useContents().contents.faqs;
}

export function useOffersContent() {
  return useContents().contents.offers;
}

export function useRoomsContent() {
  return useContents().contents.rooms;
}

export function useSectionVariants() {
  return useContents().sectionVariants;
}
