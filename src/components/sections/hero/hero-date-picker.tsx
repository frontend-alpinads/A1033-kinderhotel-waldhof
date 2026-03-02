"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";
import { DateRange, DayButton } from "react-day-picker";
import React from "react";
import { useCommonTranslations } from "@/lib/i18n";

type DatePickerProps = {
  children: ReactNode;
  onDateSelect?: (dates: { arrival: string; departure: string }) => void;
  selectedDates?: { arrival: string; departure: string };
  align?: "start" | "end" | "center";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  avoidCollision?: boolean;
  contentClassname?: string;
  minDate?: Date;
  maxDate?: Date;
};

function HeroCalendarDayButton({
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
        "focus-visible:ring-ring text-foreground hover:bg-primary hover:text-background inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-none p-0 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 lg:text-sm",
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

export function HeroDatePicker({
  children,
  onDateSelect,
  selectedDates,
  align = "start",
  side = "right",
  sideOffset = 8,
  avoidCollision = true,
  contentClassname,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const common = useCommonTranslations();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const parseYmd = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
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
  const handleDayClick = (day: Date) => {
    if (dateRange?.from && dateRange?.to && dateRange?.from !== dateRange?.to) {
      setDateRange({ from: day, to: undefined });
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
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
      onDateSelect({ arrival, departure });
    }
    setOpen(false);
  };

  const calendarContent = (
    <>
      {/* Calendar Container */}
      <div className="">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleDateRangeSelect}
          startMonth={minDate || new Date()}
          endMonth={maxDate}
          numberOfMonths={1}
          weekStartsOn={1}
          onDayClick={handleDayClick}
          className="w-full bg-transparent p-0"
          components={{
            DayButton: HeroCalendarDayButton,
          }}
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-4 w-full",
            caption: "flex justify-between items-center mb-4 px-2 relative",
            caption_label:
              "text-sm font-normal text-foreground flex-1 text-center",
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
            range_start: "rounded-r-none rounded-l-sm bg-primary/10",
            range_end: "rounded-l-none rounded-r-sm bg-primary/10",
            today: "border border-primary/40 rounded-none",
            outside: "opacity-50 data-[selected=true]:opacity-100",
            disabled: "opacity-20 pointer-events-none",
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true;
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
      </div>

      <div className="bg-border my-3 h-px w-full"></div>

      {/* Selected Dates Display */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-foreground text-xs font-normal opacity-50">
            {common.arrival}:
          </p>
          {dateRange?.from ? (
            <p className="text-foreground text-sm font-normal">
              {dateRange.from.toLocaleDateString(common.localeString, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </p>
          ) : (
            <div className="h-5"></div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-foreground text-xs font-normal opacity-50">
            {common.departure}:
          </p>
          {dateRange?.to ? (
            <p className="text-foreground text-sm font-normal">
              {dateRange.to.toLocaleDateString(common.localeString, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </p>
          ) : (
            <div className="h-5"></div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-5">
        <Button
          onClick={handleApply}
          className="w-full"
          disabled={!dateRange?.from || !dateRange?.to}
        >
          {common.apply}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className={cn(
            "bg-primary-foreground text-foreground border-border w-fit rounded-none border p-4 shadow-lg backdrop-blur-lg",
            contentClassname,
          )}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Ankunft & Abreise</DialogTitle>
          {calendarContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-primary-foreground text-foreground border-border z-50 w-auto -translate-x-full rounded-none border p-4 shadow-lg backdrop-blur-lg",
          contentClassname,
        )}
        align={align}
        side={side}
        sideOffset={sideOffset}
        avoidCollisions={avoidCollision}
      >
        {calendarContent}
      </PopoverContent>
    </Popover>
  );
}
