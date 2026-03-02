"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { DateRange, DayButton } from "react-day-picker";
import { Offer } from "@/shared-types";
import { getOfferDateRanges } from "@/lib/booking-utils";
import React from "react";
import { useEnquiryFormTranslations } from "../../i18n";

type DatePickerProps = {
  children: ReactNode;
  onDateSelect?: (dates: {
    arrival: string;
    departure: string;
    dateFlexibility: 0 | 1 | 2 | 3 | 7 | 14;
  }) => void;
  selectedDates?: { arrival: string; departure: string };
  avoidCollision?: boolean;
  contentClassname?: string;
  minDate?: Date;
  maxDate?: Date;
  minNights?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "end" | "center" | "start" | undefined;
  side?: "bottom" | "top" | "left" | "right";
  offers?: Offer[];
  selectedOffer?: Offer;
};

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "focus-visible:ring-ring text-foreground hover:bg-primary hover:text-background inline-flex h-13 w-13 cursor-pointer items-center justify-center rounded-none! p-0 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:font-normal",
        "data-[range-middle=true]:text-foreground data-[range-middle=true]:bg-transparent",
        "data-[range-start=true]:bg-primary data-[range-start=true]:border-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:border-2 data-[range-start=true]:font-normal",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:font-normal",
        className,
      )}
      {...props}
    />
  );
}

export function DesktopDatePicker({
  children,
  onDateSelect,
  selectedDates,
  avoidCollision = true,
  contentClassname,
  minDate,
  maxDate,
  minNights,
  align = "end",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  offers = [],
  selectedOffer,
  side,
}: DatePickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [dateFlexibilityDays, setDateFlexibilityDays] = useState<
    0 | 1 | 2 | 3 | 7 | 14
  >(0);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const t = useEnquiryFormTranslations();

  const offerDateRanges = useMemo(() => getOfferDateRanges(offers), [offers]);

  const startMonth = useMemo(() => {
    if (selectedOffer && selectedOffer.validityPeriods.length > 0) {
      const firstPeriod = selectedOffer.validityPeriods[0];
      const dateStr = firstPeriod.effectiveFrom || firstPeriod.from;
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, 1);
    }
    return minDate || new Date();
  }, [selectedOffer, minDate]);

  const parseYmd = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  };

  const formatDisplayDate = (date: Date, includeYear: boolean) => {
    return date.toLocaleDateString(t.localeString, {
      day: "numeric",
      month: "numeric",
      ...(includeYear ? { year: "numeric" as const } : {}),
    });
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (selectedDates?.arrival && selectedDates?.departure) {
      return {
        from: parseYmd(selectedDates.arrival),
        to: parseYmd(selectedDates.departure),
      };
    }
    return undefined;
  });

  useEffect(() => {
    console.log("Date range: ", dateRange);
  }, [dateRange]);

  // When a full range is already selected, start a new range on single click
  // by setting the clicked day as the new from and clearing to.
  // Also validates that range doesn't span across validity period gaps.
  const handleDayClick = (day: Date) => {
    if (dateRange?.from && dateRange?.to && dateRange?.from !== dateRange?.to) {
      setDateRange({ from: day, to: undefined });
      return;
    }

    // When selecting end date, validate it's in the same validity period as start date
    if (
      dateRange?.from &&
      !dateRange?.to &&
      selectedOffer &&
      selectedOffer.validityPeriods.length > 0
    ) {
      const parseDateString = (dateStr: string): Date => {
        const [dayNum, month, year] = dateStr.split(".").map(Number);
        const d = new Date(year, month - 1, dayNum);
        d.setHours(0, 0, 0, 0);
        return d;
      };

      // Check if both dates are in the SAME validity period
      const fromDate = dateRange.from;
      const toDate = day;
      const bothDatesInSamePeriod = selectedOffer.validityPeriods.some(
        (period) => {
          const periodFrom = parseDateString(
            period.effectiveFrom || period.from,
          );
          const periodTo = parseDateString(period.to);
          return (
            fromDate >= periodFrom &&
            fromDate <= periodTo &&
            toDate >= periodFrom &&
            toDate <= periodTo
          );
        },
      );

      if (!bothDatesInSamePeriod) {
        // Range would span across periods - use clicked date as new start
        setDateRange({ from: day, to: undefined });
      }
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from === range?.to) {
      setDateRange({
        from: range?.from,
        to: undefined,
      });
    } else {
      setDateRange(range);
    }
  };

  const formatLocalYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleApply = () => {
    if (onDateSelect && dateRange?.from && dateRange?.to) {
      const arrival = formatLocalYmd(dateRange.from);
      const departure = formatLocalYmd(dateRange.to);
      onDateSelect({
        arrival,
        departure,
        dateFlexibility: dateFlexibilityDays,
      });
    }
    setOpen(false);
  };

  const calendarContent = (
    <>
      {/* Calendar Container */}
      <div className="mb-5">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleDateRangeSelect}
          startMonth={startMonth}
          endMonth={maxDate}
          numberOfMonths={2}
          weekStartsOn={1}
          onDayClick={handleDayClick}
          className="w-full bg-transparent p-0"
          components={{
            DayButton: CalendarDayButton,
          }}
          classNames={{
            months: "flex gap-3",
            month: "space-y-4 w-full",
            caption: "flex justify-between items-center mb-4 px-2 relative",
            caption_label:
              "text-base font-normal text-foreground flex-1 text-center",
            nav: "flex items-center justify-between absolute inset-x-4 top-4",
            nav_button:
              "inline-flex items-center justify-center rounded-none text-sm font-normal transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0 border border-gray-200 text-background hover:text-background ",
            nav_button_previous: "order-first",
            nav_button_next: "order-last",
            button_next:
              "hover:bg-primary/10 p-1.5 rounded-none cursor-pointer aria-disabled:pointer-events-none aria-disabled:opacity-50",
            button_previous:
              "hover:bg-primary/10 p-1.5 rounded-none cursor-pointer aria-disabled:pointer-events-none aria-disabled:opacity-50",
            table: "w-full border-collapse space-y-1 mt-2",
            head_row: "flex w-full",
            weekday:
              "text-foreground rounded-none flex-1 font-normal text-sm select-none",
            head_cell:
              "text-foreground rounded-none w-10 font-normal text-sm flex-1 text-center py-2",
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-range-start=true])]:bg-primary/10 [&:has([data-range-middle=true])]:bg-primary/10 [&:has([data-range-end=true])]:bg-primary flex-1 h-10",
            range_middle: "rounded-none bg-primary/10 hover:bg-primary/50",
            range_start: "rounded-r-none rounded-l-none bg-primary/10",
            range_end: "rounded-l-none rounded-r-none bg-primary/10",

            today: "bg-border rounded-none",
            outside:
              "opacity-0 data-[selected=true]:opacity-0 pointer-events-none",
            disabled:
              "opacity-20 pointer-events-none data-[selected=true]:opacity-100",
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true;
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            // When selecting check-in or check-out date, disable dates within minNights from check-in or check-out
            if (minNights && dateRange?.from) {
              const minNextDate = new Date(dateRange?.from);
              const minPrevDate = new Date(dateRange?.from);

              minNextDate.setDate(minNextDate.getDate() + minNights);
              minPrevDate.setDate(minPrevDate.getDate() - minNights);
              if (date < minNextDate && date > dateRange?.from) return true;
              if (date > minPrevDate && date < dateRange?.from) return true;
            }
            // When an offer is selected, disable dates in gaps between validity periods
            if (selectedOffer && selectedOffer.validityPeriods.length > 0) {
              const parseDateString = (dateStr: string): Date => {
                const [day, month, year] = dateStr.split(".").map(Number);
                const d = new Date(year, month - 1, day);
                d.setHours(0, 0, 0, 0);
                return d;
              };
              const isWithinAnyPeriod = selectedOffer.validityPeriods.some(
                (period) => {
                  const from = parseDateString(
                    period.effectiveFrom || period.from,
                  );
                  const to = parseDateString(period.to);
                  return date >= from && date <= to;
                },
              );
              if (!isWithinAnyPeriod) return true;
            }
            return false;
          }}
          modifiers={{
            offersAvailable: offerDateRanges,
          }}
          modifiersClassNames={{
            offersAvailable: "bg-blue-100",
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        {offers.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <div className="size-5 bg-blue-100"></div>
              <p>{t.dateSelection.offersAvailable}</p>
            </div>
            <div className="bg-border h-px w-full"></div>
          </>
        )}

        {/* Approximate Dates */}
        <div className="flex gap-3">
          {(
            [
              {
                value: 0 as const,
                label: t.dateSelection.flexibility.exactDates,
              },
              {
                value: 1 as const,
                label: t.dateSelection.flexibility.plusMinus1Day,
              },
              {
                value: 2 as const,
                label: t.dateSelection.flexibility.plusMinus2Days,
              },
              {
                value: 3 as const,
                label: t.dateSelection.flexibility.plusMinus3Days,
              },
              {
                value: 7 as const,
                label: t.dateSelection.flexibility.plusMinus7Days,
              },
              {
                value: 14 as const,
                label: t.dateSelection.flexibility.plusMinus14Days,
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={dateFlexibilityDays === opt.value}
              onClick={() => setDateFlexibilityDays(opt.value)}
              className={`rounded-none border border-solid px-3 py-2 text-sm leading-normal font-normal whitespace-nowrap transition-colors duration-150 ${
                dateFlexibilityDays === opt.value
                  ? "bg-foreground/10 text-foreground border-foreground/20"
                  : "border-foreground/20 text-foreground hover:border-secondary bg-primary-foreground cursor-pointer"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="bg-border h-px w-full"></div>

        {/* Selected Dates Display */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-normal opacity-70">
              {t.dateSelection.selectedDatesLabel}:
            </p>
            {!dateRange?.from && !dateRange?.to && (
              <p className="text-foreground text-sm font-normal">-</p>
            )}
            <p className="text-foreground text-sm font-normal">
              {dateRange?.from &&
                formatDisplayDate(
                  dateRange.from,
                  !dateRange?.to ||
                    dateRange.from.getFullYear() !== dateRange.to.getFullYear(),
                )}{" "}
              {dateRange?.to && "-"}{" "}
              {dateRange?.to && formatDisplayDate(dateRange.to, true)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="">
          <Button
            onClick={handleApply}
            className="w-full"
            disabled={!dateRange?.from || !dateRange?.to}
          >
            {t.apply}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-primary-foreground text-foreground shadow-200 z-50 w-auto rounded-none border-none p-4 backdrop-blur-lg",
          contentClassname,
        )}
        align={align}
        side={side || "bottom"}
        avoidCollisions={avoidCollision}
      >
        {calendarContent}
      </PopoverContent>
    </Popover>
  );
}
