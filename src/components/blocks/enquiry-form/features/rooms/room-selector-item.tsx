"use client";

import Image from "next/image";
import type { Room } from "@/shared-types";
import type { EnquiryFormTranslations } from "../../i18n";

type RoomSelectorItemProps = {
  room: Room;
  t: EnquiryFormTranslations;
  onSelect: (room: Room) => void;
};

function formatPrice(price: number) {
  return `${price} €`;
}

function formatCapacity(capacity: string, t: EnquiryFormTranslations) {
  // Extract numbers from capacity string like "For 1-2 persons" or "Für 1–2 Personen"
  // Note: handles both hyphen (-) and en-dash (–)
  const match = capacity.match(/(\d+)[-–]?(\d+)?/);
  if (!match) return capacity;

  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : null;
  const range = max ? `${min}–${max}` : `${min}`;

  return `${t.for} ${range} ${t.persons}`;
}

function formatArea(area: string) {
  // Convert "44sqm" or "23 - 29 sqm" to "44 m²" / "23 - 29 m²"
  return area
    .replace(/m2|m\^2/g, "m²")
    .replace(/\b(sqm)\b/g, "m²")
    .replace(/(\d+)\s*(m²|sqm)/g, "$1 m²");
}

export function RoomSelectorItem({
  room,
  t,
  onSelect,
}: RoomSelectorItemProps) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer gap-4 rounded-none border-none bg-transparent p-4 text-left transition-colors lg:items-center"
      onClick={() => onSelect(room)}
    >
      {/* Room Image */}
      <div className="relative h-22 w-30 shrink-0 overflow-hidden rounded-none">
        <Image
          width={120}
          height={88}
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
        {/* Left side - Title and Badges */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 max-lg:gap-1">
          <p className="text-base leading-normal font-medium">{room.name}</p>
          <div className="flex gap-2">
            {room.area && (
              <span className="bg-muted text-foreground rounded-none border px-2 py-1 text-sm leading-normal font-normal">
                {formatArea(room.area)}
              </span>
            )}
            {room.capacity && (
              <span className="bg-muted text-foreground rounded-none border px-2 py-1 text-sm leading-normal font-normal">
                {formatCapacity(room.capacity, t)}
              </span>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-black/10 md:hidden"></div>

        {/* Right side - Price */}
        <div className="flex shrink-0 flex-col justify-center lg:max-w-20 lg:items-end">
          <p className="text-base leading-normal font-medium whitespace-nowrap">
            {t.from} {formatPrice(room.price)}
          </p>
          <p className="text-sm opacity-70 max-md:hidden">{t.perPerson}</p>
        </div>
      </div>
    </button>
  );
}
