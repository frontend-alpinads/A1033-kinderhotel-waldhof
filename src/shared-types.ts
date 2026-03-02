import type { Locale } from "@/lib/i18n/config";

// Helper type for localized strings
export type LocalizedString = Record<Locale, string>;

// Helper type for localized string arrays
export type LocalizedStringArray = Record<Locale, string[]>;

// Validity period for offers with multiple date ranges
export type ValidityPeriod = {
  from: string; // DD.MM.YYYY format
  to: string; // DD.MM.YYYY format
  effectiveFrom?: string; // max(from, today) - calculated at runtime
};

// Raw data types with localized fields
export type OfferData = {
  title: LocalizedString;
  validityPeriods: ValidityPeriod[];
  nights: number;
  minNights?: number;
  price: number;
  description: LocalizedString;
  features: LocalizedStringArray;
  imageSrc: string;
  longDescription?: LocalizedString;
  inclusions?: LocalizedStringArray;
};

export type RoomData = {
  id: string;
  code?: string; // AlpineBits room code (e.g., "ZAPF", "DZM", "DASU")
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currency: string;
  capacity: string; // e.g., "For 1-2 person"
  area: string; // e.g., "44sqm" or "23 - 29 sqm"
  image: string;
  images?: string[]; // Additional images for carousel
  type: string;
  features: LocalizedStringArray;
  longDescription: LocalizedString;
  includedServices: LocalizedStringArray;
};

export type FaqData = {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
};

export type TestimonialData = {
  text: LocalizedString;
  name: LocalizedString;
  country: LocalizedString;
  rating: number;
};

// Resolved types (after locale extraction) for component usage
export type Offer = {
  title: string;
  validityPeriods: ValidityPeriod[];
  nights: number;
  minNights?: number;
  price: number;
  description: string;
  features: string[];
  imageSrc: string;
  longDescription?: string;
  inclusions?: string[];
};

export type Room = {
  id: string;
  code?: string; // AlpineBits room code (e.g., "ZAPF", "DZM", "DASU")
  name: string;
  description: string;
  price: number;
  currency: string;
  capacity: string; // e.g., "For 1-2 person"
  area: string; // e.g., "44sqm" or "23 - 29 sqm"
  image: string;
  images?: string[]; // Additional images for carousel
  type: string;
  features: string[];
  longDescription: string;
  includedServices: string[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type Testimonial = {
  text: string;
  name: string;
  country: string;
  rating: number;
};
