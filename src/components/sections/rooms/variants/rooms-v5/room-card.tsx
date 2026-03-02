"use client";

import { Room } from "@/shared-types";
import { useBookingStore } from "@/stores/booking-store";
import { RoomDetails } from "../../room-details";
import { RoomCardCarousel } from "../../room-card-carousel";
import { Button } from "@/components/ui/button";
import { ArrowsOutSimpleIcon, BedIcon } from "@phosphor-icons/react";
import { useCommonTranslations } from "@/lib/i18n";

export function RoomCard({ room }: { room: Room }) {
  const { setPrefilledRoom } = useBookingStore();

  const common = useCommonTranslations();

  const handleEnquiryClick = () => {
    // Set the selected room in the booking store
    setPrefilledRoom(room);

    // Scroll to enquiry form
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-background relative flex h-105 w-full flex-col overflow-hidden lg:h-140">
      {/* Image Container */}
      <RoomCardCarousel
        images={room.images || [room.image]}
        alt={room.name}
        className="absolute inset-0 h-full w-full"
      >
        {/* Bottom overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-linear-0 from-black/50 to-black/0"></div>
        {/* Top overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-50 bg-linear-180 from-black/50 to-black/0"></div>

        {/* Top Badges */}
        <div className="text-background absolute top-3 left-3 z-10 flex flex-wrap gap-3 lg:gap-6">
          <div className="flex items-center gap-3 bg-black/40 px-3 py-2 backdrop-blur-sm">
            <BedIcon weight="regular" className="size-5" />
            <span className="text-base leading-normal">
              {common.from}{" "}
              {room.price.toLocaleString(common.localeString, {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {""}
              {common.perNightFor2}
            </span>
          </div>
        </div>
      </RoomCardCarousel>

      {/* Content Section */}
      <div className="text-background relative mt-auto flex shrink-0 flex-col border border-t-0 p-5">
        {/* Text Content */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-title text-xl leading-normal tracking-[-1%] uppercase lg:text-2xl">
            {room.name}
          </h3>

          <div className="flex gap-3">
            {Number(room.area[0]) > 0 && (
              <div className="flex items-center gap-3 px-3 py-1">
                <ArrowsOutSimpleIcon weight="regular" className="size-5" />
                <span className="text-base leading-normal">{room.area}</span>
              </div>
            )}
            <div className="flex items-center gap-3 px-3 py-1">
              <BedIcon weight="regular" className="size-5" />
              <span className="text-base leading-normal">
                {common.for} {room.capacity} {common.persons}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background mb-5 h-px w-full opacity-20"></div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 [&>button]:flex-1">
          <RoomDetails room={room}>
            <Button variant="outline" className="max-lg:px-2">
              {common.readMore}
            </Button>
          </RoomDetails>
          <Button onClick={handleEnquiryClick} className="max-lg:px-2">
            {common.enquiry}
          </Button>
        </div>
      </div>
    </div>
  );
}
