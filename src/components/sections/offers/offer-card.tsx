import { Button } from "@/components/ui/button";
import { OfferDetails } from "./offer-details";
import { useBookingStore } from "@/stores/booking-store";
import { Offer } from "@/shared-types";
import { BedIcon, TagIcon } from "@phosphor-icons/react";
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
    <div className="relative h-120 w-full overflow-hidden lg:h-127">
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="h-full w-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 h-full w-full opacity-75">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.00) 59.42%)",
          }}
        />
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 h-full w-full">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.70) 33.82%, rgba(0, 0, 0, 0.00) 51.95%)",
          }}
        />
      </div>

      {/* Top Content: Title & Date */}
      <div className="text-background absolute top-0 left-0 flex w-full flex-col items-center gap-2 p-4 text-center">
        <h3 className="font-title text-2xl leading-[140%] font-medium">
          {title}
        </h3>
        {dateRanges.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            {/* Group date ranges in pairs (2 per row) */}
            {Array.from(
              { length: Math.ceil(dateRanges.length / 2) },
              (_, rowIndex) => {
                const firstRange = dateRanges[rowIndex * 2];
                const secondRange = dateRanges[rowIndex * 2 + 1];
                return (
                  <div
                    key={rowIndex}
                    className="flex items-center gap-2 text-base leading-normal font-medium"
                  >
                    <span>{firstRange}</span>
                    {secondRange && (
                      <>
                        <span className="size-1 rounded-full bg-current" />
                        <span>{secondRange}</span>
                      </>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="text-background absolute bottom-0 left-0 flex w-full flex-col items-center gap-4">
        {/* Info Badges: Nights & Price */}
        <div className="flex w-full justify-between gap-1 gap-y-2 px-4 max-lg:flex-wrap">
          <div className="flex items-center gap-3">
            <BedIcon className="size-5" />
            <p className="text-base leading-[150%]">
              {nights} {nights === 1 ? common.night.one : common.night.other}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TagIcon className="size-5" />
            <p className="text-base leading-[150%]">
              {offersT.from}{" "}
              {price.toLocaleString(common.localeString, {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {common.perPersonOnly}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-background mx-auto h-px w-[calc(100%-2.5rem)] opacity-50" />

        {/* Description */}
        <div className="hidden w-full items-center justify-center px-4">
          <p
            dangerouslySetInnerHTML={{ __html: description }}
            className="line-clamp-3 h-18 text-base leading-[150%] tracking-[-0.16px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex w-full flex-wrap gap-3 px-4 pt-0 pb-4">
          <OfferDetails offer={offer}>
            <Button variant="outline" className="flex-1 px-2!">
              {offersT.learnMore}
            </Button>
          </OfferDetails>
          <Button onClick={handleEnquiryClick} className="flex-1 px-2!">
            {common.enquiry}
          </Button>
        </div>
      </div>
    </div>
  );
}
