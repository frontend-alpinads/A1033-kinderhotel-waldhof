"use client";

import { useState, useEffect } from "react";
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
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Room } from "@/shared-types";
import { useEnquiryFormTranslations } from "../../i18n";

type RoomSelectorProps = {
  children: React.ReactNode;
  onRoomSelect?: (room: Room | null) => void;
  selectedRoom?: Room | null;
  align?: "start" | "end";
  className?: string;
};

export function RoomSelector({
  children,
  onRoomSelect,
  align = "start",
  className,
}: RoomSelectorProps) {
  const t = useEnquiryFormTranslations();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { rooms } = useRoomsAndOffers();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRoomSelect = (room: Room) => {
    if (onRoomSelect) {
      onRoomSelect(room);
    }
    setOpen(false);
  };

  const formatPrice = (price: number) => {
    return `${price} €`;
  };

  const formatCapacity = (capacity: string) => {
    // Extract numbers from capacity string like "For 1-2 persons" or "Für 1–2 Personen"
    // Note: handles both hyphen (-) and en-dash (–)
    const match = capacity.match(/(\d+)[-–]?(\d+)?/);
    if (!match) return capacity;

    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : null;

    const range = max ? `${min}–${max}` : `${min}`;

    return `${t.for} ${range} ${t.persons}`;
  };

  const formatArea = (area: string) => {
    // Convert "44sqm" or "23 - 29 sqm" to "44 m²" / "23 - 29 m²"
    return area
      .replace(/m2|m\^2/g, "m²")
      .replace(/\b(sqm)\b/g, "m²")
      .replace(/(\d+)\s*(m²|sqm)/g, "$1 m²");
  };

  // Shared content for both Dialog and Popover
  const selectorContent = (
    <>
      {rooms.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">
            {t.noRoomsAvailable}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {rooms
            .slice()
            .sort((a, b) => a.price - b.price)
            .map((room, index) => (
              <div
                key={room.id || index}
                className="flex cursor-pointer gap-5 rounded-none transition-colors lg:items-center"
                onClick={() => handleRoomSelect(room)}
              >
                {/* Room Image */}
                <div className="relative h-19 w-24 shrink-0 overflow-hidden rounded-none max-lg:h-12 max-lg:w-15">
                  <Image
                    width={96}
                    height={76}
                    alt={room.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={room.image || "/placeholder.png"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Room Content */}
                <div className="text-foreground flex min-w-0 flex-1 gap-3 max-lg:flex-col lg:items-center">
                  {/* Left side - Title and Features */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2 max-lg:gap-1">
                    <p className="text-base leading-normal font-normal">
                      {room.name}
                    </p>
                    <div className="flex gap-2">
                      {room.area && (
                        <span className="bg-primary/0 border-muted text-primary rounded-none border px-2 py-1 text-sm leading-normal font-normal">
                          <span className="text-sm leading-normal">
                            {formatArea(room.area)}
                          </span>
                        </span>
                      )}
                      {room.capacity && (
                        <span className="bg-primary/0 border-muted text-primary rounded-none border px-2 py-1 text-sm leading-normal font-normal">
                          <span className="text-sm leading-normal font-normal">
                            {formatCapacity(room.capacity)}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side - Price */}
                  <div className="flex shrink-0 flex-col justify-center lg:items-end">
                    <p className="text-xl leading-normal font-normal whitespace-nowrap">
                      {t.from} {formatPrice(room.price)}
                    </p>
                    <p className="text-primary text-sm">{t.perPerson}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );

  // Mobile: Render Dialog
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          overlayClassName="z-190"
          className={cn(
            "bg-primary-foreground text-foreground border-border z-200 w-[calc(100vw-4rem)] overflow-y-auto rounded-none border p-4 shadow-lg backdrop-blur-lg max-lg:max-h-[90vh]!",
            className,
          )}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {t.roomSelection.chooseRoom}
          </DialogTitle>
          {selectorContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop: Render Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "border-border max-h-80 w-150 overflow-y-auto rounded-none border bg-white p-4 shadow-lg",
          className,
        )}
        align={align}
        sideOffset={8}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        {selectorContent}
      </PopoverContent>
    </Popover>
  );
}
