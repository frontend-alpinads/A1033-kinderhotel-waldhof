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
  MobileGuestsPicker,
} from "@/components/blocks/enquiry-form";
import {
  CalendarDotsIcon,
  CaretDownIcon,
  UsersIcon,
  SealCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@phosphor-icons/react";
import { useHeroContent } from "@/contents";
import { useCommonTranslations } from "@/lib/i18n/hooks";
import { useLocale } from "@/lib/i18n/context";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { getMinBookingDate } from "@/lib/booking-utils";
import { TestimonialData } from "@/shared-types";
import { roomsData } from "@/data/rooms";

type HeroBookingFormProps = {
  selectedIndex: number;
  testimonial: TestimonialData;
};

export function HeroBookingForm({
  selectedIndex,
  testimonial,
}: HeroBookingFormProps) {
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const locale = useLocale();
  const { offers } = useRoomsAndOffers();

  // Get the minimum room price
  const minPrice = Math.min(...roomsData.map((room) => room.price));
  const formattedMinPrice = `€${minPrice}`;

  const { selectedDates, guestSelection, setSelectedDates, setGuestSelection } =
    useBookingStore();

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
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
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Truncate testimonial text for mobile
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="bg-foreground">
      {/* Desktop Layout */}
      <div className="hidden h-[111px] items-center gap-8 px-8 lg:flex">
        {/* Price Section */}
        <div className="flex flex-col gap-1">
          <span className="text-background/50 text-sm">
            {common.startingFrom}
          </span>
          <div className="flex items-end gap-1">
            <span className="text-background text-[28px] leading-none font-medium">
              {formattedMinPrice}
            </span>
            <span className="text-background/50 text-sm">
              / {common.night.one}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-1 items-center gap-8">
          {/* Date Picker */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-background/35 text-xs font-medium tracking-[1.8px] uppercase">
                Step 01
              </span>
              <div className="bg-background/10 h-px flex-1" />
            </div>
            {isDesktop ? (
              <DesktopDatePicker
                onDateSelect={handleDateSelect}
                selectedDates={selectedDates || undefined}
                align="start"
                offers={offers}
                minDate={getMinBookingDate()}
              >
                <button className="group bg-background/5 border-background/10 flex cursor-pointer items-center gap-4 border p-1 pr-3 text-start">
                  <div className="bg-background/30 border-background/10 flex size-12 items-center justify-center border backdrop-blur-[25px]">
                    <CalendarDotsIcon className="text-background size-6" />
                  </div>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-background/70 text-xs">
                      {hero.bookingForm.arrivalDepartureLabel}
                    </span>
                    <span className="text-background text-sm">
                      {formatDateDisplay()}
                    </span>
                  </span>
                  <CaretDownIcon className="text-background size-6" />
                </button>
              </DesktopDatePicker>
            ) : null}
          </div>

          {/* Guest Picker */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-background/35 text-xs font-medium tracking-[1.8px] uppercase">
                Step 02
              </span>
              <div className="bg-background/10 h-px flex-1" />
            </div>
            <DesktopGuestsPicker
              selectedGuests={guestSelection}
              onGuestSelect={(guests) => {
                handleGuestSelect(guests);
                setIsGuestsOpen(true);
              }}
            >
              <button className="group bg-background/5 border-background/10 flex cursor-pointer items-center gap-4 border p-1 pr-3 text-start">
                <div className="bg-background/30 border-background/10 flex size-12 items-center justify-center border backdrop-blur-[25px]">
                  <UsersIcon className="text-background size-6" />
                </div>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-background/70 text-xs">
                    {hero.bookingForm.guests}
                  </span>
                  <span className="text-background text-sm">
                    {formatGuestDisplay()}
                  </span>
                </span>
                <CaretDownIcon className="text-background size-6" />
              </button>
            </DesktopGuestsPicker>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircleIcon className="text-background/50 size-3.5" />
              <span className="text-background/50 text-xs">
                {common.freeNonBinding}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="text-background/50 size-3.5" />
              <span className="text-background/50 text-xs">
                {common.replyWithin2Hours}
              </span>
            </div>
          </div>
          <Button
            onClick={handleCheckAvailability}
            className="bg-background text-primary hover:bg-background/90 h-14 w-full min-w-65"
          >
            {hero.bookingForm.requestOffer}
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 p-3 pt-3 lg:hidden">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-background text-sm font-medium">
            {common.makeRequest}
          </span>
          <div className="flex items-end gap-1">
            <span className="text-background/50 text-xs">{common.from}</span>
            <span className="text-background text-xl font-medium">
              {formattedMinPrice}
            </span>
            <span className="text-background/50 text-xs">
              /{common.night.one}
            </span>
          </div>
        </div>

        {/* Testimonial Snippet */}
        <div className="border-background/10 border-l-2 pl-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    weight="fill"
                    className={cn(
                      "size-[11px]",
                      i < testimonial.rating
                        ? "text-background"
                        : "text-background/30",
                    )}
                  />
                ))}
              </div>
              <span className="text-background/50 text-xs">
                {common.verifiedReviews}
              </span>
            </div>
            <p className="text-background/50 text-xs leading-relaxed">
              &ldquo;{truncateText(testimonial.text[locale], 60)}&rdquo; —{" "}
              {testimonial.name[locale]}, {testimonial.country[locale]}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-background/5 h-px w-full" />

        {/* Form Fields */}
        <div className="flex flex-col gap-2">
          {/* Date Picker */}
          <MobileDatePicker
            onDateSelect={handleDateSelect}
            selectedDates={selectedDates || undefined}
            offers={offers}
            minDate={getMinBookingDate()}
          >
            <button className="group bg-background/5 border-background/10 flex cursor-pointer items-center gap-4 border p-1 pr-3 text-start">
              <div className="bg-background/30 border-background/10 flex size-12 items-center justify-center border backdrop-blur-[25px]">
                <CalendarDotsIcon className="text-background size-6" />
              </div>
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-background/70 text-xs">
                  {hero.bookingForm.arrivalDepartureLabel}
                </span>
                <span className="text-background text-sm">
                  {formatDateDisplay()}
                </span>
              </span>
              <CaretDownIcon className="text-background size-6" />
            </button>
          </MobileDatePicker>

          {/* Guest Picker */}
          <MobileGuestsPicker
            selectedGuests={guestSelection}
            onGuestSelect={(guests) => {
              handleGuestSelect(guests);
              setIsGuestsOpen(true);
            }}
          >
            <button className="group bg-background/5 border-background/10 flex cursor-pointer items-center gap-4 border p-1 pr-3 text-start">
              <div className="bg-background/30 border-background/10 flex size-12 items-center justify-center border backdrop-blur-[25px]">
                <UsersIcon className="text-background size-6" />
              </div>
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-background/70 text-xs">
                  {hero.bookingForm.guests}
                </span>
                <span className="text-background text-sm">
                  {formatGuestDisplay()}
                </span>
              </span>
              <CaretDownIcon className="text-background size-6" />
            </button>
          </MobileGuestsPicker>

          {/* CTA Button */}
          <Button
            onClick={handleCheckAvailability}
            className="bg-background text-primary hover:bg-background/90 h-12 w-full"
          >
            {hero.bookingForm.requestOffer}
          </Button>
        </div>

        {/* Footer Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0">
          <div className="flex items-center gap-1">
            <CheckCircleIcon className="text-background/50 size-3.5" />
            <span className="text-background/50 text-[11px]">
              {common.freeNonBinding}
            </span>
          </div>
          <span className="text-background/15 text-base">·</span>
          <div className="flex items-center gap-1">
            <ClockIcon className="text-background/50 size-3.5" />
            <span className="text-background/50 text-[11px]">
              {common.replyWithin2Hours}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
