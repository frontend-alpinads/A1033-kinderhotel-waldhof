"use client";

import { RoomCard } from "./room-card";
import { RoomsCarousel } from "./rooms-carousel";
import { Room } from "@/shared-types";
import { useRoomsContent } from "@/contents";
import { RoomTabs } from "../../room-tabs";
import { useRoomTabs } from "../../hooks/use-room-tabs";

interface RoomsV5Props {
  rooms?: Room[];
}

export function RoomsV5({ rooms }: RoomsV5Props) {
  const roomsContent = useRoomsContent();
  const titleParts = roomsContent.title.split("\n");
  const { tabs, activeTab, setActiveTab, filteredRooms } = useRoomTabs({
    rooms,
  });

  return (
    <section
      id="rooms"
      className="bg-muted text-foreground relative overflow-hidden py-20 lg:py-16"
    >
      {/* Contents */}
      <div className="relative flex flex-col gap-14 lg:gap-10">
        {/* Header - responsive */}
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:grid lg:grid-cols-2 lg:gap-20 lg:px-5">
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            <h2 className="text-accent py-2 text-center text-base leading-[150%] tracking-[5%] uppercase lg:mb-1 lg:text-left">
              - {roomsContent.badge} -
            </h2>

            <p className="font-title text-foreground text-display-2 text-center font-normal opacity-80 lg:text-left">
              {titleParts[0]} {titleParts[1]}
            </p>
          </div>

          <p className="text-foreground w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80 lg:mx-0 lg:text-left">
            {roomsContent.description}
          </p>
        </div>

        {/* Tabs and Carousel - responsive */}
        <div className="relative flex flex-col gap-5 lg:gap-0">
          <div className="overflow-x-auto px-4 lg:mx-auto lg:my-0 lg:flex lg:items-center lg:justify-center lg:px-0 lg:py-4">
            <RoomTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </div>

          <RoomsCarousel
            key={activeTab}
            activeTab={activeTab}
            slides={filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          />
        </div>
      </div>
    </section>
  );
}
