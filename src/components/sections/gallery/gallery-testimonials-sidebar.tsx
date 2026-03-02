"use client";

import { UsersIcon, QuotesIcon } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n/context";
import { getTestimonials } from "@/data";
import { GalleryCta } from "./gallery-cta";

type GalleryTestimonialsSidebarProps = {
  showCta?: boolean;
  onClose?: () => void;
};

export function GalleryTestimonialsSidebar({
  showCta = false,
  onClose,
}: GalleryTestimonialsSidebarProps) {
  const locale = useLocale();
  const testimonials = getTestimonials(locale);

  const sidebarContent = {
    de: {
      title: "Von Familien vertraut",
      subtitle: "Bewertungen unserer Gäste.",
    },
    en: {
      title: "Trusted by Families",
      subtitle: "Hear testimonials from our Guests.",
    },
    it: {
      title: "Scelto dalle Famiglie",
      subtitle: "Ascolta le testimonianze dei nostri Ospiti.",
    },
  };

  const content = sidebarContent[locale];

  return (
    <div className="bg-background hidden w-80 overflow-y-auto lg:block">
      {/* Header */}
      <div className="border-input flex items-center gap-3 border-b p-3">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-sm leading-normal font-medium">{content.title}</p>
          <p className="text-xs leading-normal opacity-70">
            {content.subtitle}
          </p>
        </div>
        <UsersIcon className="size-5" weight="regular" />
      </div>

      {/* Rating Badges */}
      {/*<div className="flex gap-3 px-4 py-3">
        <div className="border-secondary/15 bg-background shadow-100 flex flex-col items-start justify-center gap-2 border px-3 py-2">
          <Image
            src="/bookingcom.png"
            alt="Booking.com"
            width={100}
            height={17}
          />
        </div>
        <div className="border-secondary/15 bg-background shadow-100 flex flex-1 flex-col items-start justify-center gap-2 border px-3 py-2">
          <Image src="/google.png" alt="Google" width={57} height={19} />
        </div>
      </div>*/}

      {/* Testimonials List */}
      <div className="flex flex-col gap-4 p-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            text={testimonial.text}
            name={testimonial.name}
            country={testimonial.country}
          />
        ))}
      </div>

      <GalleryCta className="sticky bottom-0" onClose={onClose} />
    </div>
  );
}

function TestimonialCard({
  text,
  name,
  country,
}: {
  text: string;
  name: string;
  country: string;
}) {
  // Truncate long testimonials
  const truncatedText =
    text.length > 200 ? text.substring(0, 200) + "..." : text;

  return (
    <div className="border-input bg-background flex flex-col gap-3 border p-2 backdrop-blur-[25px]">
      <div className="flex flex-col gap-2">
        <QuotesIcon className="text-primary size-6 opacity-50" weight="fill" />
        <p className="text-sm leading-normal">{truncatedText}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-normal font-medium">{name}</p>
        <p className="text-xs leading-normal">{country}</p>
      </div>
    </div>
  );
}
