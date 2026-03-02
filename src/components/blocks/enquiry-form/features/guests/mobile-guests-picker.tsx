"use client";

import { ReactNode, useState, useEffect } from "react";
import { Drawer } from "vaul";
import { useEnquiryFormTranslations } from "../../i18n";
import { GuestsPickerContent } from "./guests-picker-content";

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
};

export function MobileGuestsPicker({
  children,
  onGuestSelect,
  selectedGuests,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: GuestsPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const t = useEnquiryFormTranslations();

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
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg" />
        <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-100 flex max-h-[95svh] flex-col border-none">
          <div className="py-2">
            <Drawer.Handle />
          </div>
          <Drawer.Title className="bg-background border-border relative border-b px-4 py-5">
            {t.guestSelection.title}
          </Drawer.Title>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <GuestsPickerContent
              localAdults={localAdults}
              localChildren={localChildren}
              localChildAges={localChildAges}
              onAdultsChange={handleAdultsChange}
              onChildrenChange={handleChildrenChange}
              onChildAgeChange={handleChildAgeChange}
              onApply={handleApply}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
