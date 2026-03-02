import React from "react";
import { TranslationsProvider } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/locales";
import type { SiteVersion } from "@/lib/i18n/routing";
import type {
  SiteContents,
  SectionVariantsArray,
  SectionKey,
} from "@/contents/types";
import { ContentsProvider } from "@/contents";
import { RoomsAndOffersProvider } from "@/components/providers/rooms-and-offers-provider";
import { Enquiry } from "@/components/sections/enquiry";
import { Faqs } from "@/components/sections/faqs/faqs";
import { Gallery } from "@/components/sections/gallery/gallery";
import { Hero } from "@/components/sections/hero/hero";
import { Offers } from "@/components/sections/offers/offers";
import { Rooms } from "@/components/sections/rooms/rooms";
import { Testimonials } from "@/components/sections/testimonials/testimonials";
import { Footer } from "@/components/sections/footer/footer";
import type { Room, Offer, Faq, Testimonial } from "@/shared-types";
import { Features } from "../sections/features/features";
import { About } from "../sections/about/about";
import { BookingLightbox } from "@/components/blocks/booking/booking-suedtirol";

interface HomePageProps {
  version: SiteVersion;
  locale: Locale;
  dictionary: Dictionary;
  contents: SiteContents;
  sectionVariants: SectionVariantsArray;
  rooms: Room[];
  offers: Offer[];
  faqs: Faq[];
  testimonials: Testimonial[];
}

// Section component mapping
type SectionProps = {
  rooms?: Room[];
  offers?: Offer[];
  faqs?: Faq[];
  testimonials?: Testimonial[];
};

const sectionComponents: Record<
  SectionKey,
  (props: SectionProps) => React.JSX.Element | null
> = {
  hero: () => <Hero />,
  about: () => <About />,
  features: () => <Features />,
  gallery: () => <Gallery />,
  enquiry: () => <Enquiry />,
  testimonials: (props) => (
    <Testimonials testimonials={props.testimonials || []} />
  ),
  faqs: (props) => <Faqs faqs={props.faqs || []} />,
  offers: (props) => <Offers offers={props.offers || []} />,
  rooms: (props) => <Rooms rooms={props.rooms} />,
  footer: () => <Footer />,
};

function HomePageContent({
  rooms,
  offers,
  faqs,
  testimonials,
  sectionVariantsArray,
}: {
  rooms: Room[];
  offers: Offer[];
  faqs: Faq[];
  testimonials: Testimonial[];
  sectionVariantsArray: SectionVariantsArray;
}) {
  return (
    <>
      {sectionVariantsArray.map((entry, index) => {
        const sectionKey = Object.keys(entry)[0] as SectionKey;
        const variant = entry[sectionKey];

        // Skip disabled sections
        if (variant === false) {
          return null;
        }

        const Component = sectionComponents[sectionKey];
        if (!Component) {
          return null;
        }

        // Footer should be rendered outside RoomsAndOffersProvider
        if (sectionKey === "footer") {
          return null;
        }

        // Hide offers section when there are no offers
        if (sectionKey === "offers" && offers.length === 0) {
          return null;
        }

        return (
          <Component
            key={`${sectionKey}-${index}`}
            rooms={rooms}
            offers={offers}
            faqs={faqs}
            testimonials={testimonials}
          />
        );
      })}
    </>
  );
}

function HomePageFooter({
  sectionVariantsArray,
}: {
  sectionVariantsArray: SectionVariantsArray;
}) {
  // Find footer in the array
  const footerEntry = sectionVariantsArray.find(
    (entry) => Object.keys(entry)[0] === "footer",
  );

  if (!footerEntry) {
    return null;
  }

  const variant = footerEntry.footer;
  if (variant === false) {
    return null;
  }

  const FooterComponent = sectionComponents.footer;
  if (!FooterComponent) {
    return null;
  }

  return <FooterComponent />;
}

export function HomePage({
  version,
  locale,
  dictionary,
  contents,
  sectionVariants,
  rooms,
  offers,
  faqs,
  testimonials,
}: HomePageProps) {
  return (
    <TranslationsProvider locale={locale} dictionary={dictionary}>
      <ContentsProvider
        version={version}
        locale={locale}
        contents={contents}
        sectionVariants={sectionVariants}
      >
        <RoomsAndOffersProvider offers={offers} rooms={rooms}>
          <HomePageContent
            rooms={rooms}
            offers={offers}
            faqs={faqs}
            testimonials={testimonials}
            sectionVariantsArray={sectionVariants}
          />
        </RoomsAndOffersProvider>
        <HomePageFooter sectionVariantsArray={sectionVariants} />
        <BookingLightbox lang={locale} />
      </ContentsProvider>
    </TranslationsProvider>
  );
}
