"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CaretDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { DesktopRoomSelector } from "./desktop-room-selector";
import { MobileRoomSelector } from "./mobile-room-selector";
import { Room } from "@/shared-types";
import { useEnquiryFormTranslations } from "../../i18n";
import { getRoomMaxCapacity } from "../../model/room-capacity";

type ChildAgeData = {
  age: number;
};

type SelectedRoomData = {
  id: string;
  room: Room;
  guests: number;
  children: number;
  childAges: ChildAgeData[];
  boardOption: "half-board";
};

type SelectedRoomCardProps = {
  roomData: SelectedRoomData;
  availableRooms: Room[];
  onUpdate: (updatedRoom: SelectedRoomData) => void;
  onRemove: () => void;
  onRoomChange?: (newRoom: Room) => void;
  showRemoveButton?: boolean;
  autoOpenRoomSelector?: boolean;
};

export function SelectedRoomCard({
  roomData,
  availableRooms,
  onUpdate,
  onRemove,
  onRoomChange,
  showRemoveButton = true,
  autoOpenRoomSelector = false,
}: SelectedRoomCardProps) {
  const t = useEnquiryFormTranslations();
  const [mobileRoomSelectorOpen, setMobileRoomSelectorOpen] = useState(false);
  const [desktopRoomSelectorOpen, setDesktopRoomSelectorOpen] = useState(false);

  // Auto-open room selector when conditions are met
  useEffect(() => {
    if (autoOpenRoomSelector && roomData.room.id === "placeholder") {
      // Small delay to ensure dialog/drawer animation completes
      const timer = setTimeout(() => {
        // Check viewport to determine which selector to open (lg breakpoint = 1024px)
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        if (isDesktop) {
          setDesktopRoomSelectorOpen(true);
        } else {
          setMobileRoomSelectorOpen(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoOpenRoomSelector, roomData.room.id]);

  // Calculate room capacity limits - use first available room's capacity for placeholders
  const roomMaxCapacity =
    roomData.room.id === "placeholder" && availableRooms.length > 0
      ? getRoomMaxCapacity(availableRooms[0])
      : getRoomMaxCapacity(roomData.room);
  const currentTotalGuests = roomData.guests + roomData.children;
  const isAtCapacity = currentTotalGuests >= roomMaxCapacity;


  const handleGuestChange = (guests: number) => {
    onUpdate({ ...roomData, guests });
  };

  const handleChildrenChange = (children: number) => {
    // Reset child ages when count changes
    const childAges = Array.from({ length: children }, (_, i) => ({
      age: roomData.childAges[i]?.age || 0,
    }));
    onUpdate({ ...roomData, children, childAges });
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newChildAges = [...roomData.childAges];
    newChildAges[index] = { age };
    onUpdate({ ...roomData, childAges: newChildAges });
  };

  const handleRoomChange = (newRoom: Room | null) => {
    if (onRoomChange && newRoom) {
      onRoomChange(newRoom);
      setMobileRoomSelectorOpen(false);
      setDesktopRoomSelectorOpen(false);
    }
  };

  return (
    <div className="border-border bg-background flex flex-col gap-5 rounded-none border border-solid">
      <div className="bg-muted flex items-center justify-between p-5">
        <p className="text-base font-medium">{t.roomSelection.room.one}</p>

        {showRemoveButton && (
          <button
            onClick={onRemove}
            className="bg-destructive/10 hover:bg-destructive/20 flex size-6 cursor-pointer items-center justify-center rounded-none transition-colors"
          >
            <RemoveIcon />
            <span className="sr-only">{t.remove}</span>
          </button>
        )}
      </div>
      {/* Room Details */}
      <div className="grid grid-cols-3 items-start gap-8 px-4 max-lg:grid-cols-1 lg:px-5">
        {/* Board Option Display (Half Board Only) */}
        <div className="flex flex-col gap-3">
          <div className="text-foreground text-base font-normal">
            {t.roomSelection.board}
          </div>
          <div className="border-border text-foreground bg-muted/50 h-12 w-full rounded-none border border-solid px-4 py-3 text-base leading-normal font-normal">
            {t.roomSelection.halfBoard}
          </div>
        </div>
        {/* Adults Counter */}
        <div className="border-b pb-3">
          <div className="flex items-center justify-between py-1.5">
            <div className="text-foreground text-base font-normal">
              {t.adults.other}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  handleGuestChange(Math.max(1, roomData.guests - 1))
                }
                className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                  roomData.guests <= 1
                    ? "cursor-not-allowed opacity-20"
                    : "hover:bg-primary/10 cursor-pointer"
                }`}
                disabled={roomData.guests <= 1}
              >
                <MinusCircleIcon className="text-primary size-5" />
              </button>
              <div className="text-foreground w-6 text-center text-sm font-normal tracking-[0.7px] uppercase">
                {roomData.guests}
              </div>
              <button
                onClick={() =>
                  handleGuestChange(Math.min(8, roomData.guests + 1))
                }
                className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                  roomData.guests >= 8 || isAtCapacity
                    ? "cursor-not-allowed opacity-20"
                    : "hover:bg-primary/10 cursor-pointer"
                }`}
                disabled={roomData.guests >= 8 || isAtCapacity}
              >
                <PlusCircleIcon className="text-primary size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Counter */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between py-1.5">
            <div className="text-foreground text-base font-normal">
              {t.children.other}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  handleChildrenChange(Math.max(0, roomData.children - 1))
                }
                className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                  roomData.children <= 0
                    ? "cursor-not-allowed opacity-20"
                    : "hover:bg-primary/10 cursor-pointer"
                }`}
                disabled={roomData.children <= 0}
              >
                <MinusCircleIcon className="text-primary size-5" />
              </button>
              <div className="text-foreground w-6 text-center text-sm tracking-[0.7px] uppercase">
                {roomData.children}
              </div>
              <button
                onClick={() =>
                  handleChildrenChange(Math.min(6, roomData.children + 1))
                }
                className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                  roomData.children >= 6 || isAtCapacity
                    ? "cursor-not-allowed opacity-20"
                    : "hover:bg-primary/10 cursor-pointer"
                }`}
                disabled={roomData.children >= 6 || isAtCapacity}
              >
                <PlusCircleIcon className="text-primary size-5" />
              </button>
            </div>
          </div>

          <div className="bg-border h-px w-full"></div>
          {/* Child Age Selectors */}
          {roomData.children > 0 && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: roomData.children }, (_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="text-foreground text-sm font-medium opacity-50">
                      {t.childAge} {index + 1}
                    </div>
                    <Select
                      value={(roomData.childAges[index]?.age || 0).toString()}
                      onValueChange={(value) =>
                        handleChildAgeChange(index, parseInt(value))
                      }
                    >
                      <SelectTrigger
                        className="border-border text-foreground hover:border-primary bg-background h-12 w-full cursor-pointer rounded-none border border-solid px-4 py-3 text-base leading-normal font-normal shadow-none transition-colors"
                        showChevron={false}
                      >
                        <SelectValue />
                        <ChevronDown />
                      </SelectTrigger>
                      <SelectContent className="border-muted bg-background z-100 rounded-none border border-solid">
                        <SelectItem
                          value="0"
                          className="hover:bg-primary! hover:text-background! data-highlighted:bg-primary! data-highlighted:text-background! cursor-pointer rounded-none"
                        >
                          {"< 1"}
                        </SelectItem>
                        {Array.from({ length: 17 }, (_, i) => i + 1).map(
                          (age) => (
                            <SelectItem
                              key={age}
                              value={age.toString()}
                              className="hover:bg-primary! hover:text-background! data-highlighted:bg-primary! data-highlighted:text-background! cursor-pointer rounded-none"
                            >
                              {age}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center">
        {/* Mobile */}
        <div className="w-full lg:hidden">
          <MobileRoomSelector
            open={mobileRoomSelectorOpen}
            onOpenChange={setMobileRoomSelectorOpen}
            onRoomSelect={handleRoomChange}
          >
            <div className="flex w-full cursor-pointer items-center gap-5 px-5 py-4 max-lg:gap-3">
              {roomData.room.id === "placeholder" ? (
                <div className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-none">
                  <p className="text-base">{t.roomSelection.pleaseChooseRoom}</p>
                </div>
              ) : (
                <>
                  <div className="relative h-15 w-20 shrink-0 overflow-hidden rounded-none">
                    <Image
                      width={80}
                      height={60}
                      alt={roomData.room.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={roomData.room.image || "/placeholder.png"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col max-[380px]:max-w-32! max-md:max-w-40 md:flex-1">
                    <span className="text-foreground truncate text-base leading-normal font-medium max-lg:text-sm">
                      {roomData.room.name}
                    </span>
                  </div>
                </>
              )}

              <div className="flex-1">
                <CaretDownIcon size={24} weight="regular" className="ml-auto" />
              </div>
            </div>
          </MobileRoomSelector>
        </div>

        {/* Desktop */}
        <div className="w-full max-lg:hidden">
          <DesktopRoomSelector
            open={desktopRoomSelectorOpen}
            onOpenChange={setDesktopRoomSelectorOpen}
            onRoomSelect={handleRoomChange}
            align="center"
            className="w-[calc(100vw-8rem)]"
          >
            <div className="flex w-full cursor-pointer items-center gap-5 px-5 py-4">
              {roomData.room.id === "placeholder" ? (
                <div className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-none">
                  <p className="text-base">{t.roomSelection.pleaseChooseRoom}</p>
                </div>
              ) : (
                <>
                  <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-none">
                    <Image
                      width={76}
                      height={48}
                      alt={roomData.room.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={roomData.room.image || "/placeholder.png"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-foreground truncate text-base leading-normal font-medium">
                      {roomData.room.name}
                    </span>
                  </div>
                </>
              )}

              <div className="flex-1">
                <CaretDownIcon size={24} weight="regular" className="ml-auto" />
              </div>
            </div>
          </DesktopRoomSelector>
        </div>
      </div>
    </div>
  );
}

// Icons
const RemoveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
  >
    <path
      d="M12 2.85352H9.5V2.35352C9.5 1.95569 9.34196 1.57416 9.06066 1.29286C8.77936 1.01155 8.39782 0.853516 8 0.853516H5C4.60218 0.853516 4.22064 1.01155 3.93934 1.29286C3.65804 1.57416 3.5 1.95569 3.5 2.35352V2.85352H1C0.867392 2.85352 0.740215 2.90619 0.646447 2.99996C0.552679 3.09373 0.5 3.22091 0.5 3.35352C0.5 3.48612 0.552679 3.6133 0.646447 3.70707C0.740215 3.80084 0.867392 3.85352 1 3.85352H1.5V12.8535C1.5 13.1187 1.60536 13.3731 1.79289 13.5606C1.98043 13.7482 2.23478 13.8535 2.5 13.8535H10.5C10.7652 13.8535 11.0196 13.7482 11.2071 13.5606C11.3946 13.3731 11.5 13.1187 11.5 12.8535V3.85352H12C12.1326 3.85352 12.2598 3.80084 12.3536 3.70707C12.4473 3.6133 12.5 3.48612 12.5 3.35352C12.5 3.22091 12.4473 3.09373 12.3536 2.99996C12.2598 2.90619 12.1326 2.85352 12 2.85352ZM4.5 2.35352C4.5 2.22091 4.55268 2.09373 4.64645 1.99996C4.74021 1.90619 4.86739 1.85352 5 1.85352H8C8.13261 1.85352 8.25979 1.90619 8.35355 1.99996C8.44732 2.09373 8.5 2.22091 8.5 2.35352V2.85352H4.5V2.35352ZM10.5 12.8535H2.5V3.85352H10.5V12.8535ZM5.5 6.35352V10.3535C5.5 10.4861 5.44732 10.6133 5.35355 10.7071C5.25979 10.8008 5.13261 10.8535 5 10.8535C4.86739 10.8535 4.74021 10.8008 4.64645 10.7071C4.55268 10.6133 4.5 10.4861 4.5 10.3535V6.35352C4.5 6.22091 4.55268 6.09373 4.64645 5.99996C4.74021 5.90619 4.86739 5.85352 5 5.85352C5.13261 5.85352 5.25979 5.90619 5.35355 5.99996C5.44732 6.09373 5.5 6.22091 5.5 6.35352ZM8.5 6.35352V10.3535C8.5 10.4861 8.44732 10.6133 8.35355 10.7071C8.25979 10.8008 8.13261 10.8535 8 10.8535C7.86739 10.8535 7.74021 10.8008 7.64645 10.7071C7.55268 10.6133 7.5 10.4861 7.5 10.3535V6.35352C7.5 6.22091 7.55268 6.09373 7.64645 5.99996C7.74021 5.90619 7.86739 5.85352 8 5.85352C8.13261 5.85352 8.25979 5.90619 8.35355 5.99996C8.44732 6.09373 8.5 6.22091 8.5 6.35352Z"
      fill="#EB5252"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    className="size-6"
  >
    <path
      d="M20.166 9L12.666 16.5L5.16602 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
