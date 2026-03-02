"use client";

// NOTE for DEVs: This component is changed

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import {
  de as deLocale,
  enUS as enLocale,
  it as itLocale,
} from "date-fns/locale";

const locales = {
  en: enLocale,
  de: deLocale,
  it: itLocale,
};
const localeStrings = {
  en: "en-US",
  de: "de-DE",
  it: "it-IT",
};

export function getDateFnsLocale(locale: string) {
  const key = locale in locales ? (locale as keyof typeof locales) : "en";
  return locales[key];
}

export function getLocaleString(locale: string) {
  const key =
    locale in localeStrings ? (locale as keyof typeof localeStrings) : "en";
  return localeStrings[key];
}

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCommonTranslations } from "@/lib/i18n";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  const common = useCommonTranslations();

  const localeString = getLocaleString(common.locale);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={getDateFnsLocale(common.locale)}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(localeString, { month: "short" }),
        formatCaption: (month) =>
          month.toLocaleDateString(localeString, {
            month: "long",
            year: "numeric",
          }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none cursor-pointer hover:bg-card hover:text-primary aria-disabled:pointer-events-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none cursor-pointer hover:bg-card hover:text-primary aria-disabled:pointer-events-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-normal justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-none",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-normal",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-none pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-foreground rounded-none flex-1 font-normal text-[14px] select-none",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-r-none rounded-l-full bg-muted hover:bg-muted",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          "rounded-none bg-muted",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          "rounded-l-none rounded-r-full bg-muted hover:bg-muted",
          defaultClassNames.range_end,
        ),
        today: cn(
          "bg-card text-foreground rounded-none data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-[#cccccc] aria-selected:text-[#cccccc]",
          defaultClassNames.outside,
        ),
        disabled: cn("text-[#cccccc] opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

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
        "focus-visible:ring-ring text-foreground hover:bg-border hover:text-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-none p-0 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 lg:h-10 lg:text-sm",
        "data-[selected-single=true]:bg-secondary data-[selected-single=true]:text-foreground data-[selected-single=true]:rounded-none data-[selected-single=true]:font-normal",
        "data-[range-middle=true]:text-foreground data-[range-middle=true]:!rounded-none data-[range-middle=true]:bg-transparent",
        "data-[range-start=true]:bg-secondary data-[range-start=true]:border-secondary-20 data-[range-start=true]:text-foreground data-[range-start=true]:rounded-none data-[range-start=true]:border-2 data-[range-start=true]:font-normal",
        "data-[range-end=true]:bg-secondary data-[range-end=true]:text-foreground data-[range-end=true]:rounded-none data-[range-end=true]:font-normal",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
