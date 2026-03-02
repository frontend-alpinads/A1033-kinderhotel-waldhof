"use client";

import { Fragment, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import type { Room } from "@/shared-types";
import { useEnquiryFormTranslations } from "../../i18n";
import { RoomSelectorItem } from "./room-selector-item";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type DesktopRoomSelectorProps = {
  children: React.ReactNode;
  onRoomSelect?: (room: Room | null) => void;
  selectedRoom?: Room | null;
  align?: "start" | "end" | "center";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DesktopRoomSelector({
  children,
  onRoomSelect,
  align = "start",
  className,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: DesktopRoomSelectorProps) {
  const t = useEnquiryFormTranslations();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const { rooms } = useRoomsAndOffers();

  const handleRoomSelect = (room: Room) => {
    onRoomSelect?.(room);
    setOpen(false);
  };

  const selectionContent = (
    <>
      {rooms.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-foreground/80 text-sm">
            {t.noRoomsAvailable}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {rooms
            .slice()
            .sort((a, b) => a.price - b.price)
            .map((room, index) => (
              <Fragment key={`${room.id || room.name}-${room.price}`}>
                <RoomSelectorItem
                  room={room}
                  t={t}
                  onSelect={handleRoomSelect}
                />
                {index !== rooms.length - 1 && (
                  <div className="h-px w-full bg-black/10" />
                )}
              </Fragment>
            ))}
        </div>
      )}
    </>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-background shadow-200 max-h-[calc(50vh-5rem)] w-160 overflow-y-auto rounded-none border-none p-0",
          className,
        )}
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align={align}
        sideOffset={8}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        {selectionContent}
      </PopoverContent>
    </Popover>
  );
}
