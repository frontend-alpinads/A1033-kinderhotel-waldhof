"use client";

import { useState, useMemo } from "react";
import { useBookingStore } from "@/stores/booking-store";
import { useOfferTabsTranslations } from "../../i18n";
import type { Offer } from "@/shared-types";

// Parse date string - handles both YYYY-MM-DD (booking store) and DD.MM.YYYY (offer data)
function parseDateString(dateStr: string): Date {
  if (dateStr.includes("-")) {
    // YYYY-MM-DD format (from booking store)
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  } else {
    // DD.MM.YYYY format (from offer data)
    const [day, month, year] = dateStr.split(".").map(Number);
    return new Date(year, month - 1, day);
  }
}

// Calculate number of nights between two dates
function calculateNights(arrival: Date, departure: Date): number {
  const diffTime = departure.getTime() - arrival.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if offer is available for the selected dates
function isOfferAvailableForDates(
  offer: Offer,
  arrival: Date,
  departure: Date
): boolean {
  // Check minimum nights requirement first
  const stayNights = calculateNights(arrival, departure);
  const meetsMinNights = !offer.minNights || stayNights >= offer.minNights;
  if (!meetsMinNights) return false;

  // Use validity periods
  const periods = offer.validityPeriods.map(p => ({
    start: parseDateString(p.from),
    end: parseDateString(p.to),
  }));

  // Check if selected dates overlap with ANY period
  return periods.some(period =>
    period.start <= departure && period.end >= arrival
  );
}

export type OfferTabValue = "selected-dates" | "other-periods";

export function useOfferTabs(offers: Offer[]) {
  const [activeTab, setActiveTab] = useState<OfferTabValue>("selected-dates");
  const selectedDates = useBookingStore((state) => state.selectedDates);
  const offerTabs = useOfferTabsTranslations();

  // Check if dates are selected
  const hasDatesSelected = Boolean(
    selectedDates?.arrival && selectedDates?.departure
  );

  // Parse selected dates
  const parsedDates = useMemo(() => {
    if (!hasDatesSelected) return null;
    return {
      arrival: parseDateString(selectedDates!.arrival),
      departure: parseDateString(selectedDates!.departure),
    };
  }, [hasDatesSelected, selectedDates]);

  // Filter offers based on date availability
  const { selectedDatesOffers, otherPeriodsOffers } = useMemo(() => {
    if (!parsedDates) {
      return {
        selectedDatesOffers: offers,
        otherPeriodsOffers: [],
      };
    }

    const selected: Offer[] = [];
    const other: Offer[] = [];

    for (const offer of offers) {
      if (
        isOfferAvailableForDates(offer, parsedDates.arrival, parsedDates.departure)
      ) {
        selected.push(offer);
      } else {
        other.push(offer);
      }
    }

    return {
      selectedDatesOffers: selected,
      otherPeriodsOffers: other,
    };
  }, [offers, parsedDates]);

  // Build tabs array
  const tabs = useMemo(() => {
    return [
      { label: offerTabs.selectedDates, value: "selected-dates" as const },
      { label: offerTabs.otherPeriods, value: "other-periods" as const },
    ];
  }, [offerTabs]);

  // Get filtered offers based on active tab
  const filteredOffers = useMemo(() => {
    if (!hasDatesSelected) return offers;
    return activeTab === "selected-dates" ? selectedDatesOffers : otherPeriodsOffers;
  }, [hasDatesSelected, activeTab, selectedDatesOffers, otherPeriodsOffers, offers]);

  return {
    tabs,
    activeTab,
    setActiveTab,
    filteredOffers,
    hasDatesSelected,
    selectedDatesOffers,
    otherPeriodsOffers,
  };
}
