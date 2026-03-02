"use client";

import { Room } from "@/shared-types";
import {
  useEnquiryFormTranslations,
  type EnquiryFormTranslations,
} from "../../i18n";
import { PlusIcon } from "@phosphor-icons/react";
import { SelectedRoomCard } from "./selected-room-card";
import { DateAndGuestsSummary } from "./date-and-guests-summary";

export type ChildAgeData = {
  age: number;
};

export type SelectedRoomData = {
  id: string;
  room: Room;
  guests: number;
  children: number;
  childAges: ChildAgeData[];
  boardOption: "half-board";
};

export type RoomSelectionData = {
  selectedRooms: SelectedRoomData[];
};

type RoomSelectionContentProps = {
  tempSelection: RoomSelectionData;
  t: EnquiryFormTranslations;
  guestSummary: string;
  onRoomAdd: (room: Room | null) => void;
  onRoomUpdate: (roomId: string, updatedRoom: SelectedRoomData) => void;
  onRoomRemove: (roomId: string) => void;
  onRoomChange: (roomId: string, newRoom: Room) => void;
  selectedDates?: { arrival: string; departure: string };
  guestSelection?: { adults: number; children: number; childAges: number[] };
  onDateSelect?: (dates: { arrival: string; departure: string }) => void;
  onGuestSelect?: (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => void;
  availableRooms: Room[];
  autoOpenRoomSelectorForFirst?: boolean;
};

export function RoomSelectionContent({
  tempSelection,
  t,
  guestSummary,
  onRoomAdd,
  onRoomUpdate,
  onRoomRemove,
  onRoomChange,
  selectedDates,
  guestSelection,
  onDateSelect,
  onGuestSelect,
  availableRooms,
  autoOpenRoomSelectorForFirst = false,
}: RoomSelectionContentProps) {
  const canRemoveRoom = tempSelection.selectedRooms.length > 1;

  return (
    <>
      {/* Content */}
      <div className="flex flex-col gap-5 px-4 pt-6 pb-0 lg:px-16 lg:pt-10">
        <DateAndGuestsSummary
          t={t}
          selectedDates={selectedDates}
          guestSelection={guestSelection}
          onDateSelect={onDateSelect}
          onGuestSelect={onGuestSelect}
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 overflow-y-auto">
            {tempSelection.selectedRooms.map((roomData, index) => (
              <SelectedRoomCard
                key={roomData.id}
                roomData={roomData}
                availableRooms={availableRooms}
                onUpdate={(updatedRoom) =>
                  onRoomUpdate(roomData.id, updatedRoom)
                }
                onRemove={() => onRoomRemove(roomData.id)}
                onRoomChange={(newRoom) => onRoomChange(roomData.id, newRoom)}
                showRemoveButton={canRemoveRoom}
                autoOpenRoomSelector={
                  autoOpenRoomSelectorForFirst && index === 0
                }
              />
            ))}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => onRoomAdd(null)}
              className="text-foreground hover:text-foreground flex cursor-pointer items-center gap-4 py-3 transition-colors"
            >
              <span className="flex size-5 items-center justify-center">
                <PlusIcon className="size-5" />
              </span>
              <span className="text-base font-medium">
                {t.roomSelection.addAnotherRoom}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
