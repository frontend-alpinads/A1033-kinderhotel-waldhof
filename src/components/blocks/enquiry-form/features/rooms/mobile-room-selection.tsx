"use client";

import { ReactNode, useCallback, useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import {
  RoomSelectionContent,
  RoomSelectionData,
  SelectedRoomData,
} from "./room-selection-content";
import type { Room } from "@/shared-types";
import { useEnquiryFormTranslations } from "../../i18n";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { autoMapGuestsToRooms } from "../../model/room-capacity";

type RoomSelectionProps = {
  children: ReactNode;
  onRoomSelect?: (selection: RoomSelectionData) => void;
  selectedRoom?: RoomSelectionData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MobileRoomSelection({
  children,
  onRoomSelect,
  selectedRoom,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: RoomSelectionProps) {
  const t = useEnquiryFormTranslations();
  const { rooms: availableRooms } = useRoomsAndOffers();
  const { selectedDates, setSelectedDates, guestSelection, setGuestSelection } =
    useBookingStore();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const [tempSelection, setTempSelection] = useState<RoomSelectionData>(
    selectedRoom || { selectedRooms: [] },
  );

  const createPlaceholderRoom = useCallback(
    (
      guests?: number,
      children?: number,
      childAges?: { age: number }[]
    ): SelectedRoomData => {
      return {
        id: Date.now().toString(),
        room: {
          id: "placeholder",
          name: t.roomSelection.pleaseChooseRoom,
          description: "",
          price: 0,
          currency: "EUR",
          capacity: "",
          area: "",
          image: "/placeholder.png",
          type: "all",
          features: [],
          longDescription: "",
          includedServices: [],
        } as Room,
        guests: guests ?? 0,
        children: children ?? 0,
        childAges: childAges ?? [],
        boardOption: "half-board" as const,
      };
    },
    [t.roomSelection.pleaseChooseRoom]
  );

  const ensureNonEmptySelection = useCallback(
    (selection: RoomSelectionData): RoomSelectionData => {
      if (selection.selectedRooms.length > 0) return selection;
      return { selectedRooms: [createPlaceholderRoom()] };
    },
    [createPlaceholderRoom],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) return;

      if (selectedRoom) {
        setTempSelection(ensureNonEmptySelection(selectedRoom));
        return;
      }

      setTempSelection((prev) => ensureNonEmptySelection(prev));
    },
    [ensureNonEmptySelection, selectedRoom, setOpen],
  );

  const handleRoomAdd = (room: Room | null) => {
    if (!room) {
      setTempSelection((prev) => ({
        selectedRooms: [...prev.selectedRooms, createPlaceholderRoom()],
      }));
      return;
    }

    const newRoom: SelectedRoomData = {
      id: Date.now().toString(),
      room,
      guests: 0,
      children: 0,
      childAges: [],
      boardOption: "half-board",
    };

    setTempSelection((prev) => ({
      selectedRooms: [...prev.selectedRooms, newRoom],
    }));
  };

  const handleRoomUpdate = (roomId: string, updatedRoom: SelectedRoomData) => {
    setTempSelection((prev) => {
      const newSelection = {
        selectedRooms: prev.selectedRooms.map((room) =>
          room.id === roomId ? updatedRoom : room,
        ),
      };

      // Sync total guests to booking store
      const totalAdults = newSelection.selectedRooms.reduce(
        (sum, room) => sum + room.guests,
        0
      );
      const totalChildren = newSelection.selectedRooms.reduce(
        (sum, room) => sum + room.children,
        0
      );
      const allChildAges = newSelection.selectedRooms.flatMap((room) =>
        room.childAges.map((child) => child.age)
      );

      setGuestSelection({
        adults: totalAdults,
        children: totalChildren,
        childAges: allChildAges,
      });

      return newSelection;
    });
  };

  const handleRoomRemove = (roomId: string) => {
    setTempSelection((prev) => ({
      selectedRooms: prev.selectedRooms.filter((room) => room.id !== roomId),
    }));
  };

  const handleRoomChange = (roomId: string, newRoom: Room) => {
    setTempSelection((prev) => ({
      selectedRooms: prev.selectedRooms.map((room) =>
        room.id === roomId ? { ...room, room: newRoom } : room,
      ),
    }));
  };

  const handleSave = () => {
    onRoomSelect?.(tempSelection);
    setOpen(false);
  };

  const handleDateSelect = (dates: { arrival: string; departure: string }) => {
    setSelectedDates(dates);
  };

  const handleGuestSelectInSummary = (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => {
    setGuestSelection(guests);

    // Auto-map guests to rooms based on capacity
    const updatedRooms = autoMapGuestsToRooms(
      guests,
      tempSelection.selectedRooms,
      availableRooms,
      createPlaceholderRoom
    );

    setTempSelection({ selectedRooms: updatedRooms });
  };

  const formatGuestSummary = () => {
    if (tempSelection.selectedRooms.length === 0) return "";

    const totalGuests = tempSelection.selectedRooms.reduce(
      (sum, room) => sum + room.guests,
      0,
    );
    const totalChildren = tempSelection.selectedRooms.reduce(
      (sum, room) => sum + room.children,
      0,
    );

    const adultsText =
      totalGuests === 1
        ? `1 ${t.adults.one}`
        : `${totalGuests} ${t.adults.other}`;
    const childrenText =
      totalChildren > 0
        ? totalChildren === 1
          ? `1 ${t.children.one}`
          : `${totalChildren} ${t.children.other}`
        : "";

    return childrenText ? `${adultsText}, ${childrenText}` : adultsText;
  };

  const actionButtons = (
    <div className="shadow-200 flex w-full border-t px-4 py-5 lg:px-6">
      <Button onClick={handleSave} className="w-full min-w-40">
        {t.save}
      </Button>
    </div>
  );

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleOpenChange}
      shouldScaleBackground
    >
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg" />
        <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-100 flex max-h-[100svh] flex-col border-none">
          <div className="py-2">
            <Drawer.Handle />
          </div>
          <Drawer.Title className="bg-background border-border relative border-b px-4 py-5">
            {t.roomSelection.title}
          </Drawer.Title>

          <div className="flex w-full flex-1 flex-col overflow-y-auto pb-5">
            <RoomSelectionContent
              tempSelection={tempSelection}
              t={t}
              guestSummary={formatGuestSummary()}
              onRoomAdd={handleRoomAdd}
              onRoomUpdate={handleRoomUpdate}
              onRoomRemove={handleRoomRemove}
              onRoomChange={handleRoomChange}
              selectedDates={selectedDates}
              guestSelection={guestSelection}
              onDateSelect={handleDateSelect}
              onGuestSelect={handleGuestSelectInSummary}
              availableRooms={availableRooms}
              autoOpenRoomSelectorForFirst={
                tempSelection.selectedRooms.length === 1 &&
                tempSelection.selectedRooms[0].room.id === "placeholder"
              }
            />
          </div>
          {actionButtons}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
