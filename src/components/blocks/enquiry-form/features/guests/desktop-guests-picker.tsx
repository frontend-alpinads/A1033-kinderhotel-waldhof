"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestsPickerContent } from "./guests-picker-content";
import { cn } from "@/lib/utils";

type GuestsPickerProps = {
  children: ReactNode;
  onGuestSelect?: (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => void;
  selectedGuests?: {
    adults: number;
    children: number;
    childAges: number[];
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  className?: string;
};

export function DesktopGuestsPicker({
  children,
  onGuestSelect,
  selectedGuests,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  align = "start",
  className,
}: GuestsPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const [localAdults, setLocalAdults] = useState(selectedGuests?.adults ?? 2);
  const [localChildren, setLocalChildren] = useState(
    selectedGuests?.children ?? 0,
  );
  const [localChildAges, setLocalChildAges] = useState<number[]>(
    selectedGuests?.childAges ?? [],
  );

  // Sync with external selectedGuests when it changes
  useEffect(() => {
    if (selectedGuests) {
      setLocalAdults(selectedGuests.adults);
      setLocalChildren(selectedGuests.children);
      setLocalChildAges(selectedGuests.childAges);
    }
  }, [selectedGuests]);

  const handleAdultsChange = (increment: boolean) => {
    const newAdults = increment
      ? localAdults + 1
      : Math.max(localAdults - 1, 1);
    setLocalAdults(newAdults);
  };

  const handleChildrenChange = (increment: boolean) => {
    const newChildren = increment
      ? localChildren + 1
      : Math.max(localChildren - 1, 0);

    setLocalChildren(newChildren);

    // Adjust child ages array
    if (newChildren > localChildAges.length) {
      const newAges = [...localChildAges];
      for (let i = localChildAges.length; i < newChildren; i++) {
        newAges.push(0);
      }
      setLocalChildAges(newAges);
    } else if (newChildren < localChildAges.length) {
      setLocalChildAges(localChildAges.slice(0, newChildren));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...localChildAges];
    newAges[index] = age;
    setLocalChildAges(newAges);
  };

  const handleApply = () => {
    if (onGuestSelect) {
      onGuestSelect({
        adults: localAdults,
        children: localChildren,
        childAges: localChildAges,
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-primary-foreground text-foreground shadow-200 z-50 rounded-none border-none p-4 backdrop-blur-lg",
          className,
        )}
        align={align}
        side="bottom"
        sideOffset={8}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <GuestsPickerContent
          localAdults={localAdults}
          localChildren={localChildren}
          localChildAges={localChildAges}
          onAdultsChange={handleAdultsChange}
          onChildrenChange={handleChildrenChange}
          onChildAgeChange={handleChildAgeChange}
          onApply={handleApply}
        />
      </PopoverContent>
    </Popover>
  );
}
