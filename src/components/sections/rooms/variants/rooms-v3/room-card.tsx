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
    <div className="bg-background relative flex h-120 w-full flex-col overflow-hidden p-4 lg:h-140">
      {/* Image Container */}
      <RoomCardCarousel
        images={room.images || [room.image]}
        alt={room.name}
        className="mb-4 w-full flex-1 overflow-hidden"
      >
        {/* Price Badge - Bottom Right */}
        <div
          style={{
            clipPath:
              "polygon( 7.932% 5.87%,7.932% 5.87%,8.027% 4.899%,8.144% 4.005%,8.279% 3.193%,8.431% 2.47%,8.599% 1.841%,8.779% 1.314%,8.972% 0.893%,9.174% 0.585%,9.383% 0.395%,9.599% 0.331%,100% 0.331%,100% 100%,0% 100%,7.932% 5.87% )",
          }}
          className="bg-accent text-background absolute right-0 bottom-0 z-10 flex items-center px-3 py-2 pl-10 text-base leading-normal lg:gap-3 lg:p-3 lg:pl-10 lg:text-xl"
        >
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
      <div className="bg-background text-foreground flex shrink-0 flex-col">
        {/* Text Content */}
        <h3 className="font-title mb-4 text-xl leading-normal tracking-[-1%] uppercase lg:text-2xl">
          {room.name}
        </h3>

        <div className="mb-9 flex flex-wrap gap-3">
          {Number(room.area[0]) > 0 && (
            <div className="flex items-center gap-3">
              <ArrowsOutSimpleIcon weight="regular" className="size-5" />
              <span className="text-base leading-normal">{room.area}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <BedIcon weight="regular" className="size-5" />
            <span className="text-base leading-normal">
              {common.for} {room.capacity} {common.persons}
            </span>
          </div>
        </div>

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
