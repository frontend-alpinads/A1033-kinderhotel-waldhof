"use client";

import { Room } from "@/shared-types";
import { useBookingStore } from "@/stores/booking-store";
import { RoomDetails } from "../../room-details";
import { RoomCardCarousel } from "../../room-card-carousel";
import { Button } from "@/components/ui/button";
import { ArrowsOutSimpleIcon, BedIcon } from "@phosphor-icons/react";
import { useCommonTranslations } from "@/lib/i18n";
import { TagIcon } from "lucide-react";

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
    <div className="bg-background relative flex w-full flex-col overflow-hidden">
      {/* Image Container - 16:9 aspect ratio */}

      <RoomCardCarousel
        images={room.images || [room.image]}
        alt={room.name}
        className="aspect-3/2 w-full overflow-hidden lg:aspect-video"
        progressType="dots"
      >
        {/* Price Badge - Bottom Right */}
        <div className="bg-accent text-accent-foreground absolute right-0 bottom-0 z-10 flex items-center px-3 py-2 text-base leading-normal font-medium max-lg:max-w-[calc(100%-120px)] max-lg:px-2 max-lg:py-1 max-lg:text-sm lg:gap-2">
          {common.from}{" "}
          {room.price.toLocaleString(common.localeString, {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span className="">{common.perPersonOnly}</span>
        </div>
      </RoomCardCarousel>

      {/* Content Section */}
      <div className="bg-background text-foreground flex shrink-0 flex-col gap-5 p-3 lg:p-5">
        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h3 className="font-title text-xl leading-normal font-medium tracking-[-1%]">
            {room.name}
          </h3>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 py-2">
              <BedIcon weight="regular" className="text-accent size-5" />
              <span className="text-base leading-normal font-semibold">
                {common.for} {room.capacity}
              </span>
            </div>
            {Number(room.area[0]) > 0 && (
              <div className="flex items-center gap-3 py-2">
                <ArrowsOutSimpleIcon
                  weight="regular"
                  className="text-accent size-5"
                />
                <span className="text-base leading-normal font-semibold">
                  {room.area}
                </span>
              </div>
            )}
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
