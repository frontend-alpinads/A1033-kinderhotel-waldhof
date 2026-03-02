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
import { ReactNode, useCallback, useState } from "react";
import {
  RoomSelectionContent,
  RoomSelectionData,
  SelectedRoomData,
} from "./room-selection-content";
import { useBookingStore } from "@/stores/booking-store";
import { Room } from "@/shared-types";
import { XIcon } from "@phosphor-icons/react";
import { useEnquiryFormTranslations } from "../../i18n";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { autoMapGuestsToRooms } from "../../model/room-capacity";

type RoomSelectionProps = {
  children: ReactNode;
  onRoomSelect?: (selection: RoomSelectionData) => void;
  selectedRoom?: RoomSelectionData;
};

export function DesktopRoomSelection({
  children,
  onRoomSelect,
  selectedRoom,
}: RoomSelectionProps) {
  const t = useEnquiryFormTranslations();
  const { rooms: availableRooms } = useRoomsAndOffers();
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<RoomSelectionData>(
    selectedRoom || { selectedRooms: [] },
  );

  const { selectedDates, setSelectedDates, guestSelection, setGuestSelection } =
    useBookingStore();

  const createPlaceholderRoom = useCallback(
    (
      guests?: number,
      children?: number,
      childAges?: { age: number }[],
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
    [t.roomSelection.pleaseChooseRoom],
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

      // If a selection is provided by parent, use it as the editing baseline
      if (selectedRoom) {
        setTempSelection(ensureNonEmptySelection(selectedRoom));
        return;
      }

      setTempSelection((prev) => ensureNonEmptySelection(prev));
    },
    [ensureNonEmptySelection, selectedRoom],
  );

  const handleRoomAdd = (room: Room | null) => {
    if (!room) {
      setTempSelection((prev) => ({
        selectedRooms: [...prev.selectedRooms, createPlaceholderRoom()],
      }));
      return;
    }

    const newRoom: SelectedRoomData = {
      id: Date.now().toString(), // Simple ID generation
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
        0,
      );
      const totalChildren = newSelection.selectedRooms.reduce(
        (sum, room) => sum + room.children,
        0,
      );
      const allChildAges = newSelection.selectedRooms.flatMap((room) =>
        room.childAges.map((child) => child.age),
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
    if (onRoomSelect) {
      onRoomSelect(tempSelection);
    }
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
      createPlaceholderRoom,
    );

    setTempSelection({ selectedRooms: updatedRooms });
  };

  const formatGuestSummary = () => {
    if (tempSelection.selectedRooms.length === 0) {
      return "";
    }

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

  // Action buttons section (used differently for mobile vs desktop)
  const actionButtons = (
    <div className="flex w-full justify-end border-t px-4 py-5 lg:px-8 lg:py-6">
      <Button onClick={handleSave} className="min-w-40">
        {t.save}
      </Button>
    </div>
  );

  // Render Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/40 backdrop-blur-[10px]"
        showCloseButton={false}
        className="bg-background flex h-[90vh]! max-w-300! flex-col items-start gap-0 rounded-none border-none p-0"
      >
        {/* Header */}
        <DialogHeader className="border-border flex w-full flex-row items-center justify-between border-b border-solid px-8 py-6">
          <DialogTitle className="text-foreground text-xl leading-normal font-normal">
            {t.roomSelection.title}
          </DialogTitle>
          <DialogClose className="cursor-pointer">
            <span className="sr-only">{t.roomSelection.title}</span>
            <XIcon className="size-6 text-[#1B1B1B]" />
          </DialogClose>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
