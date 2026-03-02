"use client";

import { EnquiryFormTranslations, useEnquiryFormTranslations } from "../../i18n";
import { CalendarDotsIcon, PencilIcon, UsersIcon } from "@phosphor-icons/react";
import { DesktopDatePicker } from "../date/desktop-date-picker";
import { MobileDatePicker } from "../date/mobile-date-picker";
import { DesktopGuestsPicker } from "../guests/desktop-guests-picker";
import { MobileGuestsPicker } from "../guests/mobile-guests-picker";

type DateAndGuestsSummaryProps = {
  t: EnquiryFormTranslations;
  selectedDates?: { arrival: string; departure: string };
  guestSelection?: { adults: number; children: number; childAges: number[] };
  onDateSelect?: (dates: { arrival: string; departure: string }) => void;
  onGuestSelect?: (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => void;
};

const calculateNights = (arrival: string, departure: string): number => {
  if (!arrival || !departure) return 0;
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDateWithWeekday = (dateStr: string, locale: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString(locale, { weekday: "short" });
  const formatted = date.toLocaleDateString("de-DE");
  return `${weekday} ${formatted}`;
};

const formatGuestBreakdown = (
  adults: number,
  children: number,
  childAges: number[],
  translations: {
    adults: { one: string; other: string };
    children: { one: string; other: string };
  },
): string => {
  const adultsText =
    adults === 1 ? translations.adults.one : translations.adults.other;
  const childrenText =
    children === 1 ? translations.children.one : translations.children.other;

  let breakdown = `${adults} ${adultsText}`;
  if (children > 0) {
    breakdown += ` • ${children} ${childrenText}`;
    if (childAges.length > 0) {
      breakdown += ` (${childAges.join(", ")})`;
    }
  }
  return breakdown;
};

export function DateAndGuestsSummary({
  t,
  selectedDates,
  guestSelection,
  onDateSelect,
  onGuestSelect,
}: DateAndGuestsSummaryProps) {
  const nights = selectedDates
    ? calculateNights(selectedDates.arrival, selectedDates.departure)
    : 0;
  const dateRange = selectedDates
    ? `${formatDateWithWeekday(selectedDates.arrival, t.localeString)} - ${formatDateWithWeekday(selectedDates.departure, t.localeString)}`
    : "";
  const totalGuests = guestSelection
    ? guestSelection.adults + guestSelection.children
    : 0;
  const guestBreakdown = guestSelection
    ? formatGuestBreakdown(
        guestSelection.adults,
        guestSelection.children,
        guestSelection.childAges,
        { adults: t.adults, children: t.children },
      )
    : "";
  const nightsText = nights === 1 ? t.night.one : t.night.other;
  const guestsText =
    totalGuests === 1 ? t.guests.one : t.guests.other;

  if (!selectedDates?.arrival && !guestSelection) {
    return null;
  }

  return (
    <div className="border-border border">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Date Section */}
        {selectedDates?.arrival && (
          <div className="border-border flex items-center justify-between gap-4 p-4">
            <div className="flex gap-3">
              <CalendarDotsIcon className="text-foreground size-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium">
                  {nights} {nightsText}
                </span>
                <span className="text-sm opacity-70">{dateRange}</span>
              </div>
            </div>
            {/* Desktop Date Picker Edit Button */}
            <div className="max-md:hidden">
              <DesktopDatePicker
                onDateSelect={onDateSelect}
                selectedDates={selectedDates}
                align="center"
              >
                <button
                  type="button"
                  className="border-border hover:border-secondary flex cursor-pointer items-center gap-2 rounded-none border px-3 py-2 text-sm transition-colors"
                >
                  <PencilIcon className="size-4 shrink-0" />
                  {t.edit}
                </button>
              </DesktopDatePicker>
            </div>
            {/* Mobile Date Picker Edit Button */}
            <div className="md:hidden">
              <MobileDatePicker
                onDateSelect={onDateSelect}
                selectedDates={selectedDates}
              >
                <button
                  type="button"
                  className="border-border hover:border-secondary cursor-pointer rounded-none border px-2 py-2 text-sm transition-colors"
                >
                  <PencilIcon className="size-4 shrink-0" />
                  <span className="sr-only">{t.edit}</span>
                </button>
              </MobileDatePicker>
            </div>
          </div>
        )}

        {/* Guest Section */}
        {guestSelection && (
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex gap-3">
              <UsersIcon className="text-foreground size-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium">
                  {totalGuests} {guestsText}
                </span>
                <span className="text-sm opacity-70">{guestBreakdown}</span>
              </div>
            </div>
            {/* Desktop Guest Picker Edit Button */}
            <div className="max-md:hidden">
              <DesktopGuestsPicker
                onGuestSelect={onGuestSelect}
                selectedGuests={guestSelection}
                className="w-100!"
                align="end"
              >
                <button
                  type="button"
                  className="border-border hover:border-secondary flex cursor-pointer items-center gap-2 rounded-none border px-3 py-2 text-sm transition-colors"
                >
                  <PencilIcon className="size-4 shrink-0" />
                  {t.edit}
                </button>
              </DesktopGuestsPicker>
            </div>
            {/* Mobile Guest Picker Edit Button */}
            <div className="md:hidden">
              <MobileGuestsPicker
                onGuestSelect={onGuestSelect}
                selectedGuests={guestSelection}
              >
                <button
                  type="button"
                  className="border-border hover:border-secondary cursor-pointer rounded-none border px-2 py-2 text-sm transition-colors"
                >
                  <PencilIcon className="size-4 shrink-0" />
                  <span className="sr-only">{t.edit}</span>
                </button>
              </MobileGuestsPicker>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
