import { Button } from "@/components/ui/button";
import { OfferDetails } from "../../offer-details";
import { useBookingStore } from "@/stores/booking-store";
import { Offer } from "@/shared-types";
import { BedIcon, CalendarBlankIcon, TagIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useCommonTranslations, useOffersTranslations } from "@/lib/i18n";
import { hasValidDates, getEffectiveStartDate } from "@/utils/offer-utils";

type OfferCardProps = {
  offer: Offer;
};

export function OfferCard({ offer }: OfferCardProps) {
  const { title, validityPeriods, nights, price, description, imageSrc } =
    offer;
  const { setPrefilledOffer } = useBookingStore();
  const common = useCommonTranslations();
  const offersT = useOffersTranslations();

  const handleEnquiryClick = () => {
    setPrefilledOffer(offer);
    // Scroll to enquiry form
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Format all date ranges according to current locale
  // Returns empty array if offer has no valid dates (Seekda services)
  const formatAllDateRanges = (): string[] => {
    // Skip if no valid dates (Seekda services)
    if (!hasValidDates(offer)) return [];

    // Parse DD.MM.YYYY format
    const parseDate = (dateStr: string): Date | null => {
      const parts = dateStr.split(".");
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // months are 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    };

    // Format dates according to locale
    const formatter = new Intl.DateTimeFormat(common.localeString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return validityPeriods.map((period) => {
      // Use effective start date (today if original start is in the past)
      const effectiveStart = getEffectiveStartDate(period.from);
      const start = parseDate(effectiveStart);
      const end = parseDate(period.to);

      if (!start || !end) {
        return `${effectiveStart} - ${period.to}`;
      }

      return `${formatter.format(start)} - ${formatter.format(end)}`;
    });
  };

  const dateRanges = formatAllDateRanges();

  return (
    <div className="bg-background shadow-100 relative flex h-full w-full flex-col overflow-hidden lg:p-3">
      {/* Image Container */}
      <div className="relative aspect-3/2 w-full overflow-hidden lg:aspect-video">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top Badges */}
        <div className="text-background absolute top-3 left-3 z-10 flex flex-wrap gap-3 max-lg:hidden">
          {/* Nights Badge */}
          <div className="flex items-center gap-3 bg-black/40 p-2 backdrop-blur-sm">
            <BedIcon className="size-5" />
            <span className="text-base leading-normal">
              {nights} {nights === 1 ? common.night.one : common.night.other}
            </span>
          </div>
          {/* Date Range Badge */}
          {dateRanges.length > 0 && (
            <div className="flex items-center gap-2 bg-black/40 p-2 text-base leading-normal backdrop-blur-sm">
              <span>{dateRanges[0]}</span>
              {dateRanges.length > 1 && (
                <span className="text-sm opacity-75">
                  +{dateRanges.length - 1}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price Badge - Bottom Right (desktop only) */}
        <div className="bg-accent text-accent-foreground absolute right-0 bottom-0 z-10 flex items-center gap-2 px-3 py-2 text-base leading-normal font-medium max-lg:hidden">
          {offersT.from}{" "}
          {price.toLocaleString(common.localeString, {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span>{common.perPersonOnly}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-background max-lg:bg-muted text-foreground flex flex-1 shrink-0 flex-col gap-5 p-3 lg:gap-6 lg:p-0 lg:pt-6">
        {/* Title */}
        <div className="flex flex-col gap-2 lg:contents">
          <h3 className="font-title text-xl leading-normal font-medium tracking-[-1%] lg:text-2xl">
            {title}
          </h3>

          {/* Mobile: Icon rows */}
          <div className="flex flex-col gap-2 lg:hidden">
            {/* Date row */}
            {dateRanges.length > 0 && (
              <div className="flex items-center gap-3">
                <CalendarBlankIcon className="size-5 shrink-0" />
                <span className="text-base leading-normal">
                  {dateRanges[0]}
                </span>
              </div>
            )}
            {/* Nights row */}
            <div className="flex items-center gap-3">
              <BedIcon className="size-5 shrink-0" />
              <span className="text-base leading-normal">
                {nights} {nights === 1 ? common.night.one : common.night.other}
              </span>
            </div>
            {/* Price row */}
            <div className="flex items-center gap-3">
              <TagIcon className="size-5 shrink-0" />
              <span className="text-base leading-normal">
                {offersT.from}{" "}
                {price.toLocaleString(common.localeString, {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {common.perPersonOnly}
              </span>
            </div>
          </div>

          {/* Description (desktop only) */}
          <p
            dangerouslySetInnerHTML={{ __html: description }}
            className="line-clamp-3 text-base leading-[150%] tracking-[-0.16px] max-lg:hidden"
          />
        </div>

        {/* Divider (mobile only) */}
        <div className="bg-foreground/20 h-px w-full lg:hidden" />

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 lg:mt-auto [&>button]:flex-1">
          <OfferDetails offer={offer}>
            <Button variant="outline-primary" className="max-lg:px-2">
              {offersT.learnMore}
            </Button>
          </OfferDetails>
          <Button
            onClick={handleEnquiryClick}
            variant="default"
            className="max-lg:px-2"
          >
            {common.enquiry}
          </Button>
        </div>
      </div>
    </div>
  );
}
