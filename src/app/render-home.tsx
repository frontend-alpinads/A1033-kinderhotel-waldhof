import { HomePage } from "@/components/pages/home-page";
import { getFaqs, getOffers, getRooms, getTestimonials } from "@/data";
import type { Locale } from "@/lib/i18n";
import type { SiteVersion } from "@/lib/i18n/routing";
import { getDictionary } from "@/locales";
import { getContents } from "@/contents/server";
import { filterOffersByVariant } from "@/utils/offer-utils";
// import { getRoomList } from "./actions/seekda-rooms";
// import { getOfferList } from "./actions/seekda-offers"; // Nicht verwendet - verwenden lokale Daten

export async function renderHome(version: SiteVersion, locale: Locale) {
  const dictionary = getDictionary(locale);
  const { contents, sectionVariants, filters } = await getContents(version, locale);
  const rooms = getRooms(locale);
  // Use local offers data instead of Seekda
  const allOffers = getOffers(locale);
  // Apply variant-specific offer filters
  const offers = filterOffersByVariant(allOffers, filters?.offers);
  const faqs = getFaqs(locale);
  const testimonials = getTestimonials(locale);

  return (
    <HomePage
      version={version}
      locale={locale}
      dictionary={dictionary}
      contents={contents}
      sectionVariants={sectionVariants}
      rooms={rooms || []}
      offers={offers}
      faqs={faqs}
      testimonials={testimonials}
    />
  );
}
