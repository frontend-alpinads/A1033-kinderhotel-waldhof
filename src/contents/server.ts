import type { Locale } from "@/lib/i18n";
import type { SiteVersion } from "@/lib/i18n/routing";
import type {
  SiteContents,
  SectionVariantsArray,
  LocalizedString,
  LocalizedOptionalString,
  HeroContent,
  AboutContent,
  FeaturesContent,
  GalleryContent,
  EnquiryContent,
  TestimonialsContent,
  FaqsContent,
  OffersContent,
  RoomsContent,
  VariantFilters,
} from "./types";
import {
  VariantSpecSectionFirstSchema,
  type VariantSpecSectionFirst,
} from "./schema";
import {
  loadVariantJson,
  variantKeys,
  type VariantKey,
} from "./variants-manifest";

// Map SiteVersion to VariantKey (they should align, but we validate)
function siteVersionToVariantKey(version: SiteVersion): VariantKey {
  if (variantKeys.includes(version as VariantKey)) {
    return version as VariantKey;
  }
  // Fallback to v1 if version not found
  return variantKeys[0];
}

// Helper to extract a locale from LocalizedString
function extractLocale(obj: LocalizedString, locale: Locale): string {
  return obj[locale];
}

// Helper to extract a locale from LocalizedOptionalString
function extractOptionalLocale(
  obj: LocalizedOptionalString | undefined,
  locale: Locale,
): string | undefined {
  if (!obj) return undefined;
  return obj[locale];
}

// Helper to extract locale from a record of localized strings
function extractLocaleRecord(
  record: Record<string, LocalizedString>,
  locale: Locale,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = extractLocale(value, locale);
  }
  return result;
}

// Transform section-first content to locale-specific SiteContents
function transformToSiteContents(
  content: VariantSpecSectionFirst["content"],
  locale: Locale,
): SiteContents {
  const hero: HeroContent = {
    title: extractLocale(content.hero.title, locale),
    subtitle: extractLocale(content.hero.subtitle, locale),
    socialProof: content.hero.socialProof
      ? {
          rating: content.hero.socialProof.rating,
          maxRating: content.hero.socialProof.maxRating,
          totalReviews: content.hero.socialProof.totalReviews,
          reviewsText: content.hero.socialProof.reviewsText
            ? extractLocale(content.hero.socialProof.reviewsText, locale)
            : undefined,
          link: content.hero.socialProof.link,
        }
      : undefined,
    images: content.hero.images,
    bookingForm: {
      arrivalDeparture: extractLocale(
        content.hero.bookingForm.arrivalDeparture,
        locale,
      ),
      arrivalDepartureLabel: extractLocale(
        content.hero.bookingForm.arrivalDepartureLabel,
        locale,
      ),
      guests: extractLocale(content.hero.bookingForm.guests, locale),
      guestsLabel: extractLocale(content.hero.bookingForm.guestsLabel, locale),
      adultsFormat: {
        one: extractLocale(content.hero.bookingForm.adultsFormat.one, locale),
        other: extractLocale(
          content.hero.bookingForm.adultsFormat.other,
          locale,
        ),
      },
      childrenFormat: {
        one: extractLocale(content.hero.bookingForm.childrenFormat.one, locale),
        other: extractLocale(
          content.hero.bookingForm.childrenFormat.other,
          locale,
        ),
      },
      requestOffer: extractLocale(
        content.hero.bookingForm.requestOffer,
        locale,
      ),
    },
  };

  const about: AboutContent = {
    badge: extractLocale(content.about.badge, locale),
    title: extractLocale(content.about.title, locale),
    description: extractLocale(content.about.description, locale),
    images: content.about.images,
  };

  const features: FeaturesContent = {
    badge: extractLocale(content.features.badge, locale),
    title: extractLocale(content.features.title, locale),
    description: extractLocale(content.features.description, locale),
    items: content.features.items.map((item) => ({
      title: extractLocale(item.title, locale),
      description: extractLocale(item.description, locale),
      imageSrc: item.imageSrc,
      iconName: item.iconName,
    })),
  };

  const gallery: GalleryContent = {
    badge: extractLocale(content.gallery.badge, locale),
    title: extractLocale(content.gallery.title, locale),
    description: extractLocale(content.gallery.description, locale),
    viewAll: extractLocale(content.gallery.viewAll, locale),
    tabs: extractLocaleRecord(content.gallery.tabs, locale),
    categories: content.gallery.categories,
    popup: {
      title: extractLocale(content.gallery.popup.title, locale),
      closeSrLabel: extractLocale(content.gallery.popup.closeSrLabel, locale),
    },
    highlightImages: content.gallery.highlightImages,
    images: content.gallery.images.map((img) => ({
      src: img.src,
      alt: extractLocale(img.alt, locale),
      category: img.category,
    })),
  };

  const enquiry: EnquiryContent = {
    badge: extractLocale(content.enquiry.badge, locale),
    title: extractLocale(content.enquiry.title, locale),
    description: extractLocale(content.enquiry.description, locale),
    backgroundImage: content.enquiry.backgroundImage,
    form: {
      roomType: {
        label: extractLocale(content.enquiry.form.roomType.label, locale),
        roomOnly: extractLocale(content.enquiry.form.roomType.roomOnly, locale),
        roomWithOffer: extractLocale(
          content.enquiry.form.roomType.roomWithOffer,
          locale,
        ),
      },
      dates: {
        label: extractLocale(content.enquiry.form.dates.label, locale),
        alternative: extractLocale(
          content.enquiry.form.dates.alternative,
          locale,
        ),
      },
      offer: {
        label: extractLocale(content.enquiry.form.offer.label, locale),
        choose: extractLocale(content.enquiry.form.offer.choose, locale),
      },
      room: {
        label: extractLocale(content.enquiry.form.room.label, locale),
        chooseWithGuests: extractLocale(
          content.enquiry.form.room.chooseWithGuests,
          locale,
        ),
      },
      salutation: {
        label: extractLocale(content.enquiry.form.salutation.label, locale),
        mr: extractLocale(content.enquiry.form.salutation.mr, locale),
        mrs: extractLocale(content.enquiry.form.salutation.mrs, locale),
      },
      firstName: extractLocale(content.enquiry.form.firstName, locale),
      lastName: extractLocale(content.enquiry.form.lastName, locale),
      phone: extractLocale(content.enquiry.form.phone, locale),
      email: extractLocale(content.enquiry.form.email, locale),
      message: extractLocale(content.enquiry.form.message, locale),
      newsletter: extractLocale(content.enquiry.form.newsletter, locale),
      privacyPolicy: extractLocale(content.enquiry.form.privacyPolicy, locale),
      responseTime: extractLocale(content.enquiry.form.responseTime, locale),
      submit: extractLocale(content.enquiry.form.submit, locale),
      submitting: extractLocale(content.enquiry.form.submitting, locale),
      openingNotice: extractOptionalLocale(
        content.enquiry.form.openingNotice,
        locale,
      ),
    },
  };

  const testimonials: TestimonialsContent = {
    badge: extractLocale(content.testimonials.badge, locale),
    title: extractLocale(content.testimonials.title, locale),
    description: extractLocale(content.testimonials.description, locale),
    image: content.testimonials.image,
  };

  const faqs: FaqsContent = {
    badge: extractLocale(content.faqs.badge, locale),
    title: extractLocale(content.faqs.title, locale),
    description: extractLocale(content.faqs.description, locale),
  };

  const offers: OffersContent = {
    badge: extractLocale(content.offers.badge, locale),
    title: extractLocale(content.offers.title, locale),
    description: extractLocale(content.offers.description, locale),
  };

  const rooms: RoomsContent = {
    badge: extractLocale(content.rooms.badge, locale),
    title: extractLocale(content.rooms.title, locale),
    description: extractLocale(content.rooms.description, locale),
    tabs: extractLocaleRecord(content.rooms.tabs, locale),
    logoImage: content.rooms.logoImage,
  };

  return {
    hero,
    about,
    features,
    gallery,
    enquiry,
    testimonials,
    faqs,
    offers,
    rooms,
  };
}

export async function getContents(
  version: SiteVersion,
  locale: Locale,
): Promise<{
  contents: SiteContents;
  sectionVariants: SectionVariantsArray;
  filters?: VariantFilters;
}> {
  const variantKey = siteVersionToVariantKey(version);
  const loader = loadVariantJson[variantKey];
  const loaderModule = await loader();
  const rawData = loaderModule.default;

  // Validate with Zod (section-first schema)
  const parsed = VariantSpecSectionFirstSchema.parse(rawData);

  // Transform to locale-specific SiteContents
  const contents = transformToSiteContents(parsed.content, locale);

  return {
    contents,
    sectionVariants: parsed.sectionVariants,
    filters: parsed.filters,
  };
}
