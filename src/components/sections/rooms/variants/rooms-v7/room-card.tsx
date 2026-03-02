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
    <div className="bg-card relative flex w-full flex-col overflow-hidden">
      {/* Image Container - 16:9 aspect ratio */}
      <RoomCardCarousel
        images={room.images || [room.image]}
        alt={room.name}
        className="aspect-[5/4] w-full overflow-hidden lg:aspect-video"
      >
        {/* Top Badges */}
        <div className="text-background absolute top-3 left-3 z-10 flex flex-wrap gap-3 lg:gap-6">
          <div className="flex items-center gap-3 bg-black/30 px-3 py-2 backdrop-blur-sm">
            <BedIcon weight="regular" className="size-5" />
            <span className="text-base leading-normal">
              {common.for} {room.capacity} {common.persons}
            </span>
          </div>
          {Number(room.area[0]) > 0 && (
            <div className="flex items-center gap-3 bg-black/30 px-3 py-2 backdrop-blur-sm">
              <ArrowsOutSimpleIcon weight="regular" className="size-5" />
              <span className="text-base leading-normal">{room.area}</span>
            </div>
          )}
        </div>

        {/* Price Badge - Bottom Right */}
        <div className="bg-foreground text-background font-title absolute right-0 bottom-0 z-10 flex items-center px-3 py-2 text-base leading-normal lg:gap-3">
          {common.from}{" "}
          {room.price.toLocaleString(common.localeString, {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {""}
          {common.perNightFor2}
        </div>
      </RoomCardCarousel>

      {/* Content Section */}
      <div className="bg-background text-foreground flex shrink-0 flex-col gap-5 border border-t-0 p-5">
        {/* Text Content */}
        <h3 className="font-title text-xl leading-normal tracking-[-1%] uppercase lg:text-2xl">
          {room.name}
        </h3>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 [&>button]:flex-1">
          <RoomDetails room={room}>
            <Button variant="outline-primary" className="max-lg:px-2">
              {common.readMore}
            </Button>
          </RoomDetails>
          <Button
            onClick={handleEnquiryClick}
            variant="default"
            className="max-lg:px-2"
          >
            {common.enquiry}
          </Button>
        </div>
      </div>
    </div>
  );
}
