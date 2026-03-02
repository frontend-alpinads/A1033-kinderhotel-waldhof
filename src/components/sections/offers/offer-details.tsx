"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBookingStore } from "@/stores/booking-store";
import { Offer } from "@/shared-types";
import {
  BedIcon,
  CalendarDotsIcon,
  CheckCircleIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useCommonTranslations, useOffersTranslations } from "@/lib/i18n";
import { hasValidDates, getEffectiveStartDate } from "@/utils/offer-utils";

type OfferDetailsProps = {
  offer: Offer;
  children: ReactNode;
};

export function OfferDetails({ offer, children }: OfferDetailsProps) {
  const [open, setOpen] = useState(false);
  const [showMobileButtons, setShowMobileButtons] = useState(false);
  const { setPrefilledOffer } = useBookingStore();
  const {
    title,
    validityPeriods,
    imageSrc,
    nights,
    price,
    description,
    features,
    longDescription,
    inclusions,
  } = offer;

  const common = useCommonTranslations();
  const offersT = useOffersTranslations();

  // Parse dates in DD.MM.YYYY format (reusable)
  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // months are 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  // Check if offer has valid dates
  const offerHasValidDates = hasValidDates(offer);

  // Parse and format date range according to current locale
  const formatDateRange = (): string | null => {
    if (!offerHasValidDates) return null;

    // Get first validity period
    const firstPeriod = validityPeriods[0];
    if (!firstPeriod) return null;

    // Use effective start date (today if original start is in the past)
    const effectiveStart = getEffectiveStartDate(firstPeriod.from);
    const start = parseDate(effectiveStart);
    const end = parseDate(firstPeriod.to);

    if (!start || !end) {
      return `${effectiveStart} - ${firstPeriod.to}`;
    }

    // Format dates according to locale
    const formatter = new Intl.DateTimeFormat(common.localeString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  // Format a single timeframe
  const formatTimeframe = (tfStartDate: string, tfEndDate: string): string => {
    const effectiveStart = getEffectiveStartDate(tfStartDate);
    const start = parseDate(effectiveStart);
    const end = parseDate(tfEndDate);

    if (!start || !end) {
      return `${effectiveStart} - ${tfEndDate}`;
    }

    const formatter = new Intl.DateTimeFormat(common.localeString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  const dateRange = formatDateRange();

  const handleEnquiryClick = () => {
    setPrefilledOffer(offer);
    setOpen(false); // Close the dialog
    // Wait for dialog to close before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const enquirySection = document.getElementById("enquiry-form");
        if (enquirySection) {
          enquirySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowMobileButtons(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      queueMicrotask(() => setShowMobileButtons(false));
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          overlayClassName="bg-black/80 backdrop-blur-[10px]"
          showCloseButton={false}
          className="bg-primary-foreground z-150 max-h-[95dvh] max-w-none rounded-none border-none p-0 max-lg:top-auto max-lg:bottom-0 max-lg:max-h-dvh max-lg:translate-y-0 max-lg:overflow-y-auto max-lg:rounded-none sm:max-w-[min(76rem,calc(100vw-5rem))] lg:gap-0"
        >
          <DialogHeader className="max-lg:bg-background flex flex-row items-center justify-between border-b p-6 max-lg:sticky max-lg:top-0 max-lg:z-10">
            <DialogTitle className="text-foreground text-xl font-medium">
              {offersT.offerDetails}
            </DialogTitle>
            <DialogClose className="cursor-pointer">
              <span className="sr-only">{common.close}</span>
              <XIcon className="size-6" />
            </DialogClose>
          </DialogHeader>

          <div className="text-foreground grid max-lg:pb-24 lg:max-h-[calc(95dvh-5rem)] lg:grid-cols-2">
            <div className="p-3 lg:py-8">
              {/* Image Section */}
              <div className="relative aspect-6/5 w-full overflow-hidden rounded-none lg:aspect-auto lg:h-full">
                <Image
                  fill
                  src={imageSrc}
                  alt={title}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-5 px-4 py-6 lg:overflow-y-auto lg:px-6 lg:py-8">
              <p className="font-title text-foreground text-3xl leading-[140%] font-normal uppercase">
                {title}
              </p>

              <div className="bg-border h-px w-full shrink-0"></div>

              {/* Offer Details */}
              <div className="flex flex-col gap-1 lg:grid lg:grid-cols-2">
                {dateRange && (
                  <div className="flex items-center gap-4 py-2">
                    <CalendarDotsIcon className="text-primary size-6" />
                    <p className="leading-[140%] font-normal">{dateRange}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 py-2">
                  <BedIcon className="text-primary size-6" />
                  <p className="leading-[140%] font-normal">
                    {nights}{" "}
                    {nights === 1 ? common.night.one : common.night.other}
                  </p>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <TagIcon className="text-primary size-6" />
                  <p className="leading-[140%] font-normal">
                    {offersT.from}{" "}
                    {price.toLocaleString(common.localeString, {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    / {common.perPerson}
                  </p>
                </div>
              </div>

              {/* Multiple Validity Periods Section */}
              {validityPeriods && validityPeriods.length > 1 && (
                <>
                  <div className="bg-border h-px w-full shrink-0"></div>
                  <div className="flex flex-col gap-3">
                    <p className="text-lg leading-[150%] font-normal">
                      {offersT.availablePeriods}
                    </p>
                    <ul className="space-y-2">
                      {validityPeriods.map((period, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CalendarDotsIcon className="text-primary size-5" />
                          <span className="leading-[150%]">
                            {formatTimeframe(period.from, period.to)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="bg-border h-px w-full shrink-0"></div>

              <p
                dangerouslySetInnerHTML={{ __html: description }}
                className="text-lg leading-[150%]"
              ></p>

              {/* Long Description */}
              {longDescription && (
                <>
                  <div className="bg-border h-px w-full shrink-0"></div>
                  <p
                    dangerouslySetInnerHTML={{ __html: longDescription }}
                    className="text-lg leading-[150%]"
                  ></p>
                </>
              )}

              {/* Inclusions */}
              {inclusions && inclusions.length > 0 && (
                <>
                  <div className="bg-border h-px w-full shrink-0"></div>
                  <div className="">
                    <p className="mb-3 text-lg leading-[150%] font-semibold">
                      {offersT.offerIncludes}
                    </p>
                    <ul className="space-y-2">
                      {inclusions
                        .filter((item) => item !== null)
                        .map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircleIcon
                              weight="fill"
                              className="text-primary mt-1 size-5 shrink-0"
                            />
                            <span className="text-lg leading-[150%]">
                              {item}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div className="">
                  <p className="mb-3 text-lg leading-[150%] font-normal">
                    {offersT.includedServices}
                  </p>
                  <ul className="space-y-2">
                    {features
                      .filter((feature) => feature !== null)
                      .map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircleIcon
                            weight="fill"
                            className="text-primary mt-1 size-5 shrink-0"
                          />
                          <span className="text-lg leading-[150%]">
                            {feature}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Desktop Action Buttons */}
              <div className="flex gap-4 pt-5 max-lg:hidden">
                <Button onClick={handleEnquiryClick} className="w-full">
                  {common.enquiry}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Floating Action Buttons */}
      {open &&
        showMobileButtons &&
        createPortal(
          <div
            className="bg-background fixed right-0 bottom-0 left-0 flex flex-col gap-4 px-4 py-5 transition-discrete delay-100 duration-200 lg:hidden starting:opacity-0"
            style={{
              boxShadow: "0 -4px 20px 0 rgba(42, 60, 69, 0.15)",
              zIndex: 175,
              pointerEvents: "auto",
            }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleEnquiryClick();
              }}
              className="w-full"
            >
              {common.enquiry}
            </Button>
          </div>,
          document.body,
        )}
    </>
  );
}
