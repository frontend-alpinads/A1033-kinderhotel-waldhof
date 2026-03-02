import Image from "next/image";
import type { EnquiryFormTranslations } from "../../i18n";
import type { Offer } from "@/shared-types";

type OfferSelectionItemProps = {
  offer: Offer;
  t: EnquiryFormTranslations;
  onSelect: (offer: Offer) => void;
};

export function OfferSelectionItem({
  offer,
  t,
  onSelect,
}: OfferSelectionItemProps) {
  const formatDateRange = () => {
    // Use validity periods - use effectiveFrom if available, otherwise use from
    const periods = offer.validityPeriods.map(p => ({
      start: p.effectiveFrom || p.from,
      end: p.to,
    }));

    // Format each period as "DD.MM. - DD.MM." with year only on last
    const formattedPeriods = periods.map((period, index) => {
      const isLastPeriod = index === periods.length - 1;
      // For simple display, keep DD.MM.YYYY format but only show year on last
      const startParts = period.start.split(".");
      const endParts = period.end.split(".");

      if (startParts.length !== 3 || endParts.length !== 3) {
        return `${period.start} - ${period.end}`;
      }

      // Show year only on the last period's end date
      const startStr = periods.length > 1 ? `${startParts[0]}.${startParts[1]}.` : period.start;
      const endStr = isLastPeriod ? period.end : `${endParts[0]}.${endParts[1]}.`;

      return `${startStr} - ${endStr}`;
    });

    return formattedPeriods.join(" & ");
  };

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer gap-4 rounded-none border-none bg-transparent p-4 text-left transition-colors"
      onClick={() => onSelect(offer)}
    >
      {/* Offer Image */}
      <div className="relative h-22 w-30 shrink-0 overflow-hidden rounded-none">
        <Image
          width={120}
          height={88}
          alt={offer.title}
          className="absolute inset-0 h-full w-full object-cover"
          src={offer.imageSrc || "/placeholder.png"}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      </div>

      {/* Offer Content */}
      <div className="text-foreground flex min-w-0 flex-col gap-2">
        {/* Left side - Title and Date */}
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-base leading-normal font-medium">{offer.title}</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-muted text-foreground rounded-none border px-2 py-1 text-sm leading-normal font-normal">
              {formatDateRange()}
            </span>
            {offer.minNights && (
              <span className="bg-muted text-foreground rounded-none border px-2 py-1 text-sm leading-normal font-normal">
                {offer.minNights}{" "}
                {offer.minNights === 1 ? t.night.one : t.night.other}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
