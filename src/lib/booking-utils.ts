import { getBookingConfig } from "@/hotel-config";
import type { Offer } from "@/shared-types";

/**
 * Gets the minimum date for bookings (hotel opening date)
 */
export function getMinBookingDate(): Date {
  const config = getBookingConfig();
  const [year, month, day] = config.minDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Checks if we should show the opening notice banner
 * Returns true if today is before the opening date
 */
export function shouldShowOpeningNotice(): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today < getMinBookingDate();
}

/**
 * Gets the effective minimum date for date selection
 * Returns the later of: opening date, today, or offer start date
 */
export function getEffectiveMinDate(offerStartDate?: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hotelOpeningDate = getMinBookingDate();
  let minDate = today < hotelOpeningDate ? hotelOpeningDate : today;

  if (offerStartDate) {
    const offerStart = parseOfferDate(offerStartDate);
    if (offerStart && offerStart > minDate) {
      minDate = offerStart;
    }
  }

  return minDate;
}

/**
 * Parses an offer end date string (DD.MM.YYYY) to a Date object
 */
export function parseOfferEndDate(offerEndDate?: string): Date | undefined {
  if (!offerEndDate) return undefined;
  return parseOfferDate(offerEndDate) || undefined;
}

/**
 * Parses a date string in DD.MM.YYYY format to a Date object
 */
function parseOfferDate(dateStr: string): Date | null {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // months are 0-indexed
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Gets available date ranges from offers
 * Returns DateRange compatible with react-day-picker modifiers
 */
export type OfferDateRange = {
  from: Date;
  to: Date;
  offerTitle: string;
};

export function getOfferDateRanges(offers: Offer[]): OfferDateRange[] {
  const ranges: OfferDateRange[] = [];

  for (const offer of offers) {
    for (const period of offer.validityPeriods) {
      const from = parseOfferDate(period.effectiveFrom || period.from);
      const to = parseOfferDate(period.to);

      if (from && to) {
        ranges.push({
          from,
          to,
          offerTitle: offer.title,
        });
      }
    }
  }

  return ranges;
}
