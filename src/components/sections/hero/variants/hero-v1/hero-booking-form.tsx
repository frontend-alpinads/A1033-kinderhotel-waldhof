"use client";

import { Button } from "@/components/ui/button";
import {
  DesktopDatePicker,
  MobileDatePicker,
  DesktopGuestsPicker,
} from "@/components/blocks/enquiry-form";
import { useBookingStore } from "@/stores/booking-store";
import { useState, useEffect } from "react";
import { track } from "@vercel/analytics/react";
import {
  CalendarDotsIcon,
  CaretDownIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useCommonTranslations } from "@/lib/i18n/hooks";
import { useHeroContent } from "@/contents";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { getMinBookingDate } from "@/lib/booking-utils";

interface HeroBookingFormProps {
  stacked?: boolean;
}

export function HeroBookingForm({ stacked = false }: HeroBookingFormProps) {
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const { offers } = useRoomsAndOffers();
  const { selectedDates, guestSelection, setSelectedDates, setGuestSelection } =
    useBookingStore();

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    };

    // Check on mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDateSelect = (dates: { arrival: string; departure: string }) => {
    setSelectedDates(dates);
  };

  const handleGuestSelect = (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => {
    setGuestSelection(guests);
  };

  const formatDateDisplay = () => {
    if (!selectedDates) return hero.bookingForm.arrivalDeparture;

    const arrivalDate = new Date(selectedDates.arrival);
    const departureDate = new Date(selectedDates.departure);

    return `${arrivalDate.toLocaleDateString(common.localeString, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })} - ${departureDate.toLocaleDateString(common.localeString, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })}`;
  };

  const formatGuestDisplay = () => {
    const { adults, children } = guestSelection;
    if (adults === 2 && children === 0 && !isGuestsOpen)
      return hero.bookingForm.guestsLabel;

    const adultsText =
      adults === 1
        ? hero.bookingForm.adultsFormat.one
        : hero.bookingForm.adultsFormat.other.replace(
            "{count}",
            String(adults),
          );
    const childrenText =
      children > 0
        ? children === 1
          ? hero.bookingForm.childrenFormat.one
          : hero.bookingForm.childrenFormat.other.replace(
              "{count}",
              String(children),
            )
        : "";
    return childrenText ? `${adultsText}, ${childrenText}` : adultsText;
  };

  const handleCheckAvailability = () => {
    track("hero-booking-form-button-clicked", {
      route: "/",
    });
    // Data is already in the store, just scroll to enquiry form
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className={`flex w-full flex-col gap-6 overflow-hidden rounded-none bg-black/20 p-3 backdrop-blur-md ${
        stacked ? "" : "lg:flex-row"
      }`}
    >
      {/* Guests Picker */}
      <DesktopGuestsPicker
        selectedGuests={guestSelection}
        onGuestSelect={(guests) => {
          handleGuestSelect(guests);
          setIsGuestsOpen(true);
        }}
      >
        <button className="hidden flex-1 cursor-pointer items-center gap-3 text-start lg:flex">
          <div className="bg-background/30 flex size-12 shrink-0 items-center justify-center rounded-none border border-white/10">
            <UsersIcon className="text-background size-6" />
          </div>
          <span className="flex flex-1 flex-col gap-2">
            <span className="text-sm leading-none font-normal text-white/70">
              {hero.bookingForm.guests}
            </span>
            <span className="text-primary-foreground text-base leading-none font-normal">
              {formatGuestDisplay()}
            </span>
          </span>
          <CaretDownIcon className="text-background size-6" />
        </button>
      </DesktopGuestsPicker>

      {/* Date Selection */}
      {isDesktop ? (
        <DesktopDatePicker
          onDateSelect={handleDateSelect}
          selectedDates={selectedDates || undefined}
          align="center"
          offers={offers}
          minDate={getMinBookingDate()}
        >
          <button
            type="button"
            className="flex flex-1 cursor-pointer items-center gap-3 text-start"
          >
            <div className="bg-background/30 flex size-12 shrink-0 items-center justify-center rounded-none border border-white/10">
              <CalendarDotsIcon className="text-background size-6" />
            </div>
            <span className="flex flex-1 flex-col gap-2">
              <span className="text-sm leading-none font-normal text-white/70">
                {hero.bookingForm.arrivalDepartureLabel}
              </span>
              <span className="text-primary-foreground text-base leading-none">
                {formatDateDisplay()}
              </span>
            </span>
            <CaretDownIcon className="text-background size-6" />
          </button>
        </DesktopDatePicker>
      ) : (
        <MobileDatePicker
          onDateSelect={handleDateSelect}
          selectedDates={selectedDates || undefined}
          offers={offers}
          minDate={getMinBookingDate()}
        >
          <button
            type="button"
            className="flex flex-1 cursor-pointer items-center gap-3 text-start"
          >
            <div className="bg-background/30 flex size-12 shrink-0 items-center justify-center rounded-none border border-white/10">
              <CalendarDotsIcon className="text-background size-6" />
            </div>
            <span className="flex flex-1 flex-col gap-2">
              <span className="text-sm leading-none font-normal text-white/70">
                {hero.bookingForm.arrivalDepartureLabel}
              </span>
              <span className="text-primary-foreground text-base leading-none">
                {formatDateDisplay()}
              </span>
            </span>
            <CaretDownIcon className="text-background size-6" />
          </button>
        </MobileDatePicker>
      )}

      {/* Check Availability Button */}
      <Button variant="default" className="" onClick={handleCheckAvailability}>
        <span>{hero.bookingForm.requestOffer}</span>
      </Button>
    </div>
  );
}
