import type { Locale } from "@/lib/i18n/config";
import type {
  LocalizedString,
  LocalizedStringArray,
  RoomData,
  Room,
  OfferData,
  Offer,
  FaqData,
  Faq,
  TestimonialData,
  Testimonial,
} from "@/shared-types";

/**
 * Extracts the localized string for the given locale
 */
export function getLocalizedString(
  localized: LocalizedString,
  locale: Locale,
): string {
  return localized[locale];
}

/**
 * Extracts the localized string array for the given locale
 */
export function getLocalizedArray(
  localized: LocalizedStringArray,
  locale: Locale,
): string[] {
  return localized[locale];
}

/**
 * Converts RoomData with localized fields to a Room with extracted locale strings
 */
export function localizeRoom(room: RoomData, locale: Locale): Room {
  return {
    ...room,
    name: getLocalizedString(room.name, locale),
    description: getLocalizedString(room.description, locale),
    longDescription: getLocalizedString(room.longDescription, locale),
    features: getLocalizedArray(room.features, locale),
    includedServices: getLocalizedArray(room.includedServices, locale),
  };
}

/**
 * Converts OfferData with localized fields to an Offer with extracted locale strings
 */
export function localizeOffer(offer: OfferData, locale: Locale): Offer {
  return {
    title: getLocalizedString(offer.title, locale),
    description: getLocalizedString(offer.description, locale),
    features: getLocalizedArray(offer.features, locale),
    validityPeriods: offer.validityPeriods,
    nights: offer.nights,
    minNights: offer.minNights,
    price: offer.price,
    imageSrc: offer.imageSrc,
    longDescription: offer.longDescription
      ? getLocalizedString(offer.longDescription, locale)
      : undefined,
    inclusions: offer.inclusions
      ? getLocalizedArray(offer.inclusions, locale)
      : undefined,
  };
}

/**
 * Converts FaqData with localized fields to a Faq with extracted locale strings
 */
export function localizeFaq(faq: FaqData, locale: Locale): Faq {
  return {
    ...faq,
    question: getLocalizedString(faq.question, locale),
    answer: getLocalizedString(faq.answer, locale),
  };
}

/**
 * Converts TestimonialData with localized fields to a Testimonial with extracted locale strings
 */
export function localizeTestimonial(
  testimonial: TestimonialData,
  locale: Locale,
): Testimonial {
  return {
    ...testimonial,
    text: getLocalizedString(testimonial.text, locale),
    name: getLocalizedString(testimonial.name, locale),
    country: getLocalizedString(testimonial.country, locale),
  };
}
