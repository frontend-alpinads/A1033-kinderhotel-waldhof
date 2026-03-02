"use client";

import { useDictionary } from "./context";
import type { Dictionary } from "@/locales";

export function useNavTranslations() {
  const dict = useDictionary();
  return dict.nav;
}

export function useRoomsTranslations() {
  const dict = useDictionary();
  return dict.rooms;
}

export function useOffersTranslations() {
  const dict = useDictionary();
  return dict.offers;
}

export function useTestimonialsTranslations() {
  const dict = useDictionary();
  return dict.testimonials;
}

export function useFaqsTranslations() {
  const dict = useDictionary();
  return dict.faqs;
}

export function useFooterTranslations() {
  const dict = useDictionary();
  return dict.footer;
}

export function useCommonTranslations() {
  const dict = useDictionary();
  return dict.common;
}

// Type helpers for scoped translations
export type NavTranslations = Dictionary["nav"];
export type RoomsTranslations = Dictionary["rooms"];
export type OffersTranslations = Dictionary["offers"];
export type TestimonialsTranslations = Dictionary["testimonials"];
export type FaqsTranslations = Dictionary["faqs"];
export type FooterTranslations = Dictionary["footer"];
export type CommonTranslations = Dictionary["common"];
