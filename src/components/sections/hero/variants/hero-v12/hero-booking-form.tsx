"use client";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import { useState, useEffect } from "react";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import {
  DesktopDatePicker,
  MobileDatePicker,
  DesktopGuestsPicker,
} from "@/components/blocks/enquiry-form";
import {
  CalendarDotsIcon,
  CaretDownIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useHeroContent } from "@/contents";
import { useCommonTranslations } from "@/lib/i18n/hooks";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { getMinBookingDate } from "@/lib/booking-utils";

type HeroBookingFormProps = {
  hideGuestSelectionInMobile?: boolean;
};

export function HeroBookingForm({
  hideGuestSelectionInMobile = false,
}: HeroBookingFormProps) {
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
    <div className="grid w-full grid-cols-[2fr_2fr_1fr] gap-6 overflow-hidden max-lg:flex max-lg:flex-col lg:items-center lg:gap-8">
      {/* Date Selection */}
      {isDesktop ? (
        <DesktopDatePicker
          onDateSelect={handleDateSelect}
          selectedDates={selectedDates || undefined}
          align="start"
          offers={offers}
          minDate={getMinBookingDate()}
        >
          <button className="group flex flex-1 cursor-pointer items-center gap-4 text-start">
            <div className="bg-background/30 flex size-12 items-center justify-center border border-white/10 transition-all duration-300">
              <CalendarDotsIcon className="text-background size-6" />
            </div>
            <span className="flex flex-1 flex-col gap-2">
              <span className="text-white/70 text-sm leading-none font-normal">
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
          <button className="group flex flex-1 cursor-pointer items-center gap-4 text-start">
            <div className="bg-background/20 group-hover:bg-primary/10 border-foreground/10 flex size-12 items-center justify-center border transition-all duration-300">
              <CalendarDotsIcon className="text-primary size-6" />
            </div>
            <span className="flex flex-1 flex-col gap-2">
              <span className="text-foreground/70 text-sm leading-none font-normal">
                {hero.bookingForm.arrivalDepartureLabel}
              </span>
              <span className="text-foreground text-base leading-none">
                {formatDateDisplay()}
              </span>
            </span>

            <CaretDownIcon className="text-foreground size-6" />
          </button>
        </MobileDatePicker>
      )}

      {/* Guests Picker */}
      <DesktopGuestsPicker
        selectedGuests={guestSelection}
        onGuestSelect={(guests) => {
          handleGuestSelect(guests);
          setIsGuestsOpen(true);
        }}
      >
        <button
          className={cn(
            "group font-ui hidden flex-1 cursor-pointer items-center gap-4 text-start lg:flex",
            hideGuestSelectionInMobile && "hidden lg:flex",
          )}
        >
          <div className="bg-background/30 flex size-12 items-center justify-center border border-white/10 transition-all duration-300">
            <UsersIcon className="text-background size-6" />{" "}
          </div>
          {/* Guests Selection */}
          <span className="flex flex-1 flex-col items-start gap-2">
            <span className="text-white/70 text-sm leading-none font-normal">
              {hero.bookingForm.guests}
            </span>
            <span className="text-primary-foreground text-base leading-none">
              {formatGuestDisplay()}
            </span>
          </span>

          <CaretDownIcon className="text-background size-6" />
        </button>
      </DesktopGuestsPicker>

      {/* Check Availability Button */}
      <Button onClick={handleCheckAvailability}>
        <span className="w-full whitespace-pre-wrap">
          {hero.bookingForm.requestOffer}
        </span>
      </Button>
    </div>
  );
}
