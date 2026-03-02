import type { Locale } from "@/lib/i18n/config";
import { roomsData } from "./rooms";
import { offersData } from "./offers";
import { testimonialsData } from "./testimonials";
import { faqsData } from "./faqs";
import {
  localizeRoom,
  localizeOffer,
  localizeTestimonial,
  localizeFaq,
} from "./utils";
import type { Room, Offer, Testimonial, Faq } from "@/shared-types";

// Locale-aware getter functions
export function getRooms(locale: Locale): Room[] {
  return roomsData.map((room) => localizeRoom(room, locale));
}

export function getOffers(locale: Locale): Offer[] {
  return offersData.map((offer) => localizeOffer(offer, locale));
}

export function getTestimonials(locale: Locale): Testimonial[] {
  return testimonialsData.map((testimonial) =>
    localizeTestimonial(testimonial, locale)
  );
}

export function getFaqs(locale: Locale): Faq[] {
  return faqsData.map((faq) => localizeFaq(faq, locale));
}

// Legacy exports for backward compatibility (default to German)
export const rooms = getRooms("de");
export const offers = getOffers("de");
export const TESTIMONIALS = getTestimonials("de");
export const faqs = getFaqs("de");

// Also export the data arrays for direct access if needed
export { roomsData, offersData, testimonialsData, faqsData };
