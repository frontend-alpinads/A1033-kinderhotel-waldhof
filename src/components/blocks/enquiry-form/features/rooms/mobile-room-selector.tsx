"use client";

import { Fragment, useState } from "react";
import { Drawer } from "vaul";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { useEnquiryFormTranslations } from "../../i18n";
import type { Room } from "@/shared-types";
import { RoomSelectorItem } from "./room-selector-item";

type MobileRoomSelectorProps = {
  children: React.ReactNode;
  onRoomSelect?: (room: Room | null) => void;
  selectedRoom?: Room | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MobileRoomSelector({
  children,
  onRoomSelect,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: MobileRoomSelectorProps) {
  const t = useEnquiryFormTranslations();
  const { rooms } = useRoomsAndOffers();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

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
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-120 bg-black/40 backdrop-blur-lg" />
        <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-150 flex max-h-[95svh] flex-col border-none">
          <div className="py-2">
            <Drawer.Handle />
          </div>
          <Drawer.Title className="bg-background border-border relative border-b px-4 py-5">
            {t.roomSelection.chooseRoom}
          </Drawer.Title>

          <div className="flex-1 overflow-y-auto">{selectionContent}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
