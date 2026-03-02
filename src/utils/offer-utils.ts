import { Offer } from "@/shared-types";
import type { OfferFilters } from "@/contents/types";

/**
 * Parse DD.MM.YYYY format to Date object
 */
export function parseDateDDMMYYYY(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

/**
 * Format Date to DD.MM.YYYY
 */
export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Check if offer has valid dates (non-empty validityPeriods array)
 */
export function hasValidDates(offer: Offer): boolean {
  return offer.validityPeriods && offer.validityPeriods.length > 0;
}

/**
 * Get effective start date (max of offer start date and today)
 * Returns original string if no valid date, or today if start is in past
 */
export function getEffectiveStartDate(startDateStr: string): string {
  const startDate = parseDateDDMMYYYY(startDateStr);
  if (!startDate) return startDateStr; // Return as-is if invalid

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return startDate > today ? startDateStr : formatDateDDMMYYYY(today);
}

/**
 * Check if offer is bookable (considering minimum nights)
 * Returns TRUE if: no dates OR any validity period is still bookable
 */
export function isOfferBookable(offer: Offer): boolean {
  // No dates = always bookable (services like Seekda)
  if (!hasValidDates(offer)) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if any validity period is still bookable
  return offer.validityPeriods.some((period) => {
    const endDate = parseDateDDMMYYYY(period.to);
    if (!endDate) return true; // Can't parse = include anyway

    // Calculate latest possible arrival (endDate - minNights + 1)
    const minNights = offer.minNights || offer.nights || 1;
    const latestArrival = new Date(endDate);
    latestArrival.setDate(latestArrival.getDate() - minNights + 1);

    return today <= latestArrival;
  });
}

/**
 * Filter active offers (keeps non-dated + valid dated offers)
 */
export function filterActiveOffers(offers: Offer[]): Offer[] {
  return offers.filter(isOfferBookable);
}

/**
 * Parse YYYY-MM-DD format to Date object
 */
function parseDateYYYYMMDD(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

/**
 * Check if any validity period overlaps with the filter date range
 */
function hasOverlappingValidity(
  offer: Offer,
  validAfter?: string,
  validBefore?: string
): boolean {
  // No date filters = always passes
  if (!validAfter && !validBefore) return true;

  // No validity periods = passes (can't filter by date)
  if (!hasValidDates(offer)) return true;

  const filterStart = validAfter ? parseDateYYYYMMDD(validAfter) : null;
  const filterEnd = validBefore ? parseDateYYYYMMDD(validBefore) : null;

  // Check if any validity period overlaps with filter range
  return offer.validityPeriods.some((period) => {
    const periodStart = parseDateDDMMYYYY(period.from);
    const periodEnd = parseDateDDMMYYYY(period.to);

    // Can't parse dates = include anyway
    if (!periodStart || !periodEnd) return true;

    // Check overlap: period must start before filter end AND end after filter start
    const startsBeforeFilterEnd = !filterEnd || periodStart <= filterEnd;
    const endsAfterFilterStart = !filterStart || periodEnd >= filterStart;

    return startsBeforeFilterEnd && endsAfterFilterStart;
  });
}

/**
 * Filter offers based on variant-specific filters
 * - titleContains: show if title contains ANY term (OR logic, case-insensitive)
 * - titleExcludes: hide if title contains ANY term (case-insensitive)
 * - validAfter/validBefore: filter by validity period overlap
 */
export function filterOffersByVariant(
  offers: Offer[],
  filters?: OfferFilters
): Offer[] {
  if (!filters) return offers;

  return offers.filter((offer) => {
    const titleLower = offer.title.toLowerCase();

    // titleContains: must match at least one term
    if (filters.titleContains && filters.titleContains.length > 0) {
      const matches = filters.titleContains.some((term) =>
        titleLower.includes(term.toLowerCase())
      );
      if (!matches) return false;
    }

    // titleExcludes: must not match any term
    if (filters.titleExcludes && filters.titleExcludes.length > 0) {
      const excluded = filters.titleExcludes.some((term) =>
        titleLower.includes(term.toLowerCase())
      );
      if (excluded) return false;
    }

    // Date filtering
    if (!hasOverlappingValidity(offer, filters.validAfter, filters.validBefore)) {
      return false;
    }

    return true;
  });
}
