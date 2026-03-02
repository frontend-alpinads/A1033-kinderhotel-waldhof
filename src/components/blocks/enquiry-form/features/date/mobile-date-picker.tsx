"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DateLib,
  DateRange,
  DayButton,
  formatWeekdayName,
} from "react-day-picker";
import { useEnquiryFormTranslations } from "../../i18n";
import { getDateFnsLocale } from "@/components/ui/calendar";
import {
  differenceInCalendarMonths,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { Offer } from "@/shared-types";
import {
  getOfferDateRanges,
  OfferDateRange,
} from "@/lib/booking-utils";

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
  offers?: Offer[];
  selectedOffer?: Offer;
};

type InfiniteScrollCalendarProps = {
  weekdayLabels: string[];
  dateRange: DateRange | undefined;
  onDateRangeSelect: (range: DateRange | undefined) => void;
  onDayClick: (day: Date) => void;
  startMonth: Date;
  minDate?: Date;
  maxDate?: Date;
  minNights?: number;
  monthsSafetyCap?: number;
  offerDateRanges?: OfferDateRange[];
  selectedOffer?: Offer;
};

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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
        "focus-visible:ring-ring text-foreground hover:bg-primary hover:text-background inline-flex h-full w-full cursor-pointer items-center justify-center rounded-none! p-0 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",

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

function InfiniteScrollCalendar({
  weekdayLabels,
  dateRange,
  onDateRangeSelect,
  onDayClick,
  startMonth,
  minDate,
  maxDate,
  minNights,
  monthsSafetyCap = 60,
  offerDateRanges = [],
  selectedOffer,
}: InfiniteScrollCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const maxMonthsAllowed = useMemo(() => {
    if (!maxDate) return monthsSafetyCap;
    const maxMonth = startOfMonth(maxDate);
    return Math.max(1, differenceInCalendarMonths(maxMonth, startMonth) + 1);
  }, [maxDate, startMonth, monthsSafetyCap]);

  // Calculate the date range for weeks to hide (all weeks before minDate's week)
  const hideWeeksRange = useMemo(() => {
    if (!minDate) {
      return undefined;
    }

    // Get the start of minDate's week based on weekStartsOn (Monday = 1)
    const minDateWeekStart = startOfWeek(minDate, { weekStartsOn: 1 });

    // If startMonth is on or after minDate's week start, nothing to hide
    if (startMonth >= minDateWeekStart) {
      return undefined;
    }

    // Hide all dates from startMonth to the day before minDate's week starts
    return {
      from: startMonth,
      to: subDays(minDateWeekStart, 1),
    };
  }, [startMonth, minDate]);

  const INITIAL_MONTHS = 6;
  const LOAD_MORE_STEP = 6;
  const LOAD_MORE_THRESHOLD_PX = 240;

  const [monthsToShow, setMonthsToShow] = useState<number>(() =>
    Math.min(INITIAL_MONTHS, maxMonthsAllowed),
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (monthsToShow >= maxMonthsAllowed) return;

    const remaining = el.scrollHeight - (el.scrollTop + el.clientHeight);
    if (remaining > LOAD_MORE_THRESHOLD_PX) return;

    setMonthsToShow((prev) =>
      Math.min(prev + LOAD_MORE_STEP, maxMonthsAllowed),
    );
  }, [monthsToShow, maxMonthsAllowed]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="overflow-y-auto px-4"
    >
      {/* Weekdays */}
      <div className="bg-background sticky top-0 z-10 grid grid-cols-7">
        {weekdayLabels.map((label, idx) => (
          <div
            key={`${idx}-${label}`}
            className="text-foreground py-5 text-center text-sm font-normal select-none"
          >
            {label}
          </div>
        ))}
      </div>

      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={onDateRangeSelect}
        startMonth={startMonth}
        endMonth={maxDate}
        numberOfMonths={monthsToShow}
        weekStartsOn={1}
        hideWeekdays
        onDayClick={onDayClick}
        className="w-full bg-transparent px-0 py-4"
        components={{
          DayButton: CalendarDayButton,
        }}
        classNames={{
          months: "flex flex-col gap-3 w-full",
          month: "w-full",
          month_grid: "w-full",
          weeks: "w-full",
          month_caption: "px-0 pl-4",
          caption: "flex justify-between items-center mb-4 px-0 relative",
          caption_label:
            "text-base font-normal text-foreground flex-1 text-start",
          nav: "flex items-center justify-between absolute inset-x-4 top-4 hidden",
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
          week: "grid grid-cols-7 w-full",
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
                const from = parseDateString(period.effectiveFrom || period.from);
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
          hideWeeks: hideWeeksRange ?? [],
        }}
        modifiersClassNames={{
          offersAvailable: "bg-blue-100",
          hideWeeks: "hidden",
        }}
      />
    </div>
  );
}

export function MobileDatePicker({
  children,
  onDateSelect,
  selectedDates,
  minDate,
  maxDate,
  minNights,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  offers = [],
  selectedOffer,
}: DatePickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [dateFlexibilityDays, setDateFlexibilityDays] = useState<
    0 | 1 | 2 | 3 | 7 | 14
  >(0);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const t = useEnquiryFormTranslations();
  const weekStartsOn = 1 as const;

  const offerDateRanges = useMemo(() => getOfferDateRanges(offers), [offers]);

  const weekdayLabels = useMemo(() => {
    const locale = getDateFnsLocale(t.locale);
    const options = { locale, weekStartsOn };
    const dateLib = new DateLib(options);
    const start = dateLib.startOfWeek(new Date(2021, 0, 4));
    return Array.from({ length: 7 }, (_, i) =>
      formatWeekdayName(dateLib.addDays(start, i), options, dateLib),
    );
  }, [t.locale]);

  const startMonth = useMemo(() => {
    if (selectedOffer && selectedOffer.validityPeriods.length > 0) {
      const firstPeriod = selectedOffer.validityPeriods[0];
      const dateStr = firstPeriod.effectiveFrom || firstPeriod.from;
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, 1);
    }
    const base = minDate ?? new Date();
    return startOfMonth(base);
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
          const periodFrom = parseDateString(period.effectiveFrom || period.from);
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

  const infiniteCalendarKey = useMemo(() => {
    const startKey = startMonth.getTime();
    const maxKey = maxDate ? startOfMonth(maxDate).getTime() : "none";
    return `${startKey}-${maxKey}`;
  }, [startMonth, maxDate]);

  const calendarContent = (
    <>
      {/* Calendar Container */}
      <InfiniteScrollCalendar
        key={infiniteCalendarKey}
        weekdayLabels={weekdayLabels}
        dateRange={dateRange}
        onDateRangeSelect={handleDateRangeSelect}
        onDayClick={handleDayClick}
        startMonth={startMonth}
        minDate={minDate}
        maxDate={maxDate}
        minNights={minNights}
        offerDateRanges={offerDateRanges}
        selectedOffer={selectedOffer}
      />

      <div className="flex flex-col gap-4 px-4 pb-5">
        {offers.length > 0 && (
          <>
            <div className="bg-border h-px w-full"></div>

            <div className="flex items-center gap-2">
              <div className="size-3 bg-blue-100"></div>
              <p className="text-sm">{t.dateSelection.offersAvailable}</p>
            </div>
          </>
        )}

        {/* Approximate Dates */}
        <div className="-mx-4 overflow-x-auto">
          <div className="flex gap-3 px-4">
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
    <Drawer.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
      shouldScaleBackground
    >
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg" />
        <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-100 flex max-h-[95svh] flex-col border-none">
          <div className="py-2">
            <Drawer.Handle />
          </div>
          <Drawer.Title className="bg-background border-border relative border-b px-4 py-5">
            {t.dateSelection.title}
          </Drawer.Title>
          {calendarContent}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
