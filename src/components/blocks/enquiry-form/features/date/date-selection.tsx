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
import { ReactNode, useState, useEffect } from "react";
import { DatePicker } from "./date-picker";
import {
  CalendarDotsIcon,
  CaretDownIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useEnquiryFormTranslations } from "../../i18n";

type DateSelectionProps = {
  children: ReactNode;
  onDateSelect?: (dates: {
    arrival: string;
    departure: string;
    alternativeArrival?: string;
    alternativeDeparture?: string;
  }) => void;
  selectedDates?: {
    arrival: string;
    departure: string;
    alternativeArrival?: string;
    alternativeDeparture?: string;
  };
  minDate?: Date;
  maxDate?: Date;
};

export function DateSelection({
  children,
  onDateSelect,
  selectedDates,
  minDate,
  maxDate,
}: DateSelectionProps) {
  const t = useEnquiryFormTranslations();
  const [open, setOpen] = useState(false);
  const [tempDates, setTempDates] = useState(
    selectedDates || {
      arrival: "",
      departure: "",
      alternativeArrival: "",
      alternativeDeparture: "",
    },
  );
  const [showAlternativeDate, setShowAlternativeDate] = useState(
    !!(
      selectedDates?.alternativeArrival && selectedDates?.alternativeDeparture
    ),
  );
  const [primaryDatePickerOpen, setPrimaryDatePickerOpen] = useState(false);

  // Auto-open the first date picker when dialog opens and no dates are selected
  useEffect(() => {
    if (open && !tempDates.arrival && !tempDates.departure) {
      // Small delay to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        setPrimaryDatePickerOpen(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, tempDates.arrival, tempDates.departure]);

  const handleDateSelect = (dates: { arrival: string; departure: string }) => {
    setTempDates({ ...tempDates, ...dates });
  };

  const handleAlternativeDateSelect = (dates: {
    arrival: string;
    departure: string;
  }) => {
    setTempDates({
      ...tempDates,
      alternativeArrival: dates.arrival,
      alternativeDeparture: dates.departure,
    });
  };

  const handleSave = () => {
    if (onDateSelect) {
      onDateSelect(tempDates);
    }
    setOpen(false);
  };

  const toggleAlternativeDate = () => {
    setShowAlternativeDate(!showAlternativeDate);
    if (!showAlternativeDate) {
      // Clear alternative dates when hiding
      setTempDates({
        ...tempDates,
        alternativeArrival: "",
        alternativeDeparture: "",
      });
    }
  };

  // Calculate nights if both dates are selected
  const calculateNights = () => {
    if (tempDates.arrival && tempDates.departure) {
      const arrival = new Date(tempDates.arrival);
      const departure = new Date(tempDates.departure);
      const diffTime = Math.abs(departure.getTime() - arrival.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const formatDateRange = () => {
    if (tempDates.arrival && tempDates.departure) {
      const nights = calculateNights();
      const arrivalDate = new Date(tempDates.arrival);
      const departureDate = new Date(tempDates.departure);

      const arrivalDay = arrivalDate.toLocaleDateString(t.localeString, {
        weekday: "long",
      });
      const departureDay = departureDate.toLocaleDateString(t.localeString, {
        weekday: "long",
      });

      const nightsText = nights === 1 ? t.night.one : t.night.other;

      return t.dateSelection.nightsFrom
        .replace("{count}", nights.toString())
        .replace("{nights}", nightsText)
        .replace("{from}", arrivalDay)
        .replace("{to}", departureDay);
    }
    return t.dateSelection.chooseYourDates;
  };

  const formatSelectedDates = () => {
    if (tempDates.arrival && tempDates.departure) {
      const arrivalDate = new Date(tempDates.arrival);
      const departureDate = new Date(tempDates.departure);

      return `${arrivalDate.toLocaleDateString(
        t.localeString,
      )} - ${departureDate.toLocaleDateString(t.localeString)}`;
    }
    return "";
  };

  const formatAlternativeSelectedDates = () => {
    if (tempDates.alternativeArrival && tempDates.alternativeDeparture) {
      const arrivalDate = new Date(tempDates.alternativeArrival);
      const departureDate = new Date(tempDates.alternativeDeparture);

      return `${arrivalDate.toLocaleDateString(
        t.localeString,
      )} - ${departureDate.toLocaleDateString(t.localeString)}`;
    }
    return "";
  };

  const formatAlternativeDateRange = () => {
    if (tempDates.alternativeArrival && tempDates.alternativeDeparture) {
      const arrivalDate = new Date(tempDates.alternativeArrival);
      const departureDate = new Date(tempDates.alternativeDeparture);
      const diffTime = Math.abs(
        departureDate.getTime() - arrivalDate.getTime(),
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const arrivalDay = arrivalDate.toLocaleDateString(t.localeString, {
        weekday: "long",
      });
      const departureDay = departureDate.toLocaleDateString(t.localeString, {
        weekday: "long",
      });

      const nightsText = diffDays === 1 ? t.night.one : t.night.other;

      return t.dateSelection.nightsFrom
        .replace("{count}", diffDays.toString())
        .replace("{nights}", nightsText)
        .replace("{from}", arrivalDay)
        .replace("{to}", departureDay);
    }
    return t.dateSelection.chooseAlternativeDates;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/40 backdrop-blur-[10px]"
        showCloseButton={false}
        className="max-h-[95vh] max-w-screen rounded-none border-none bg-white p-0 max-lg:top-auto max-lg:bottom-0 max-lg:translate-y-0 max-lg:rounded-b-none sm:max-w-200"
      >
        {/* Header */}
        <DialogHeader className="border-border flex flex-row items-center justify-between border-b border-solid p-6">
          <DialogTitle className="text-foreground text-xl leading-normal font-normal">
            {t.dateSelection.title}
          </DialogTitle>
          <DialogClose className="cursor-pointer">
            <span className="sr-only">{t.dateSelection.title}</span>
            <XIcon className="size-6 text-[#1B1B1B]" />
          </DialogClose>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-10 px-6 pt-6 pb-0">
          {/* Primary Date Input Field with DatePicker Popover */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <DatePicker
                onDateSelect={handleDateSelect}
                selectedDates={{
                  arrival: tempDates.arrival,
                  departure: tempDates.departure,
                }}
                minDate={minDate}
                maxDate={maxDate}
                open={primaryDatePickerOpen}
                onOpenChange={setPrimaryDatePickerOpen}
              >
                <div className="border-border hover:border-secondary flex min-h-[74px] flex-1 cursor-pointer items-center justify-between rounded-none border border-solid px-5 py-4 transition-colors">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CalendarDotsIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col py-1">
                      <span className="text-foreground text-base leading-normal font-normal">
                        {formatSelectedDates() || `${t.arrivalDeparture}*`}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </DatePicker>

              {formatSelectedDates() && (
                <div className="flex justify-between max-lg:flex-col max-lg:gap-6 lg:items-center">
                  <span className="text-foreground text-base">
                    {formatDateRange()}
                  </span>

                  <button
                    className={cn(
                      "text-primary hover:text-primary flex cursor-pointer items-center gap-2.5 transition-opacity",
                      showAlternativeDate && "pointer-events-none opacity-50",
                    )}
                    onClick={toggleAlternativeDate}
                  >
                    <span className="flex size-5 items-center justify-center">
                      <PlusIcon className="size-5" />
                    </span>
                    <span className="text-sm font-normal tracking-[0.7px] uppercase">
                      {t.dateSelection.addAlternativeDate}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Alternative Date Section */}
            {showAlternativeDate && (
              <div className="flex flex-col gap-4 pt-4">
                <DatePicker
                  onDateSelect={handleAlternativeDateSelect}
                  selectedDates={{
                    arrival: tempDates.alternativeArrival || "",
                    departure: tempDates.alternativeDeparture || "",
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                >
                  <div className="border-border hover:border-secondary flex min-h-[74px] flex-1 cursor-pointer items-center justify-between rounded-none border border-solid px-5 py-4 transition-colors">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex size-6 shrink-0 items-center justify-center">
                        <CalendarDotsIcon className="text-primary size-6" />
                      </div>
                      <div className="flex flex-1 flex-col py-1">
                        <span className="text-base leading-normal font-normal">
                          {formatAlternativeSelectedDates() ||
                            t.dateSelection.alternativeArrivalDeparture}
                        </span>
                      </div>
                    </div>
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CaretDownIcon className="text-primary size-6" />
                    </div>
                  </div>
                </DatePicker>

                {formatAlternativeSelectedDates() && (
                  <div className="flex justify-between max-lg:flex-col max-lg:gap-6 lg:items-center">
                    <span className="text-foreground text-base">
                      {formatAlternativeDateRange()}
                    </span>

                    <button
                      className="text-primary hover:text-primary flex cursor-pointer items-center gap-2.5 transition-colors"
                      onClick={toggleAlternativeDate}
                    >
                      <span className="flex size-5 items-center justify-center">
                        <TrashIcon className="size-5" />
                      </span>
                      <span className="text-sm font-normal tracking-[0.7px] uppercase">
                        {t.dateSelection.removeAlternativeDate}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="bg-muted h-px w-full"></div>

          {/* Action Button */}
          <div className="flex justify-end py-5">
            <Button
              onClick={handleSave}
              disabled={!tempDates.arrival || !tempDates.departure}
            >
              {t.dateSelection.applyDates}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
