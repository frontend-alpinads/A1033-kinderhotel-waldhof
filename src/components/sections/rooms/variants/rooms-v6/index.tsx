"use client";

import { RoomCard } from "./room-card";
import { RoomsCarousel } from "./rooms-carousel";
import { Room } from "@/shared-types";
import { useRoomsContent } from "@/contents";
import { RoomTabs } from "./room-tabs";
import { useRoomTabs } from "../../hooks/use-room-tabs";

interface RoomsV2Props {
  rooms?: Room[];
}

export function RoomsV6({ rooms }: RoomsV2Props) {
  const roomsContent = useRoomsContent();
  const titleParts = roomsContent.title.split("\n");
  const { tabs, activeTab, setActiveTab, filteredRooms } = useRoomTabs({
    rooms,
  });

  return (
    <section
      id="rooms"
      className="bg-muted text-foreground relative overflow-hidden py-20 lg:py-30"
    >
      {/* Contents */}
      <div className="relative flex flex-col gap-14 lg:gap-20">
        {/* Header - responsive */}
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:grid lg:grid-cols-2 lg:gap-20 lg:px-5">
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            <h2 className="text-accent py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1 lg:text-left">
              - {roomsContent.badge} -
            </h2>

            <p className="font-title text-display-2 text-center font-medium lg:text-left">
              {titleParts[0]} {titleParts[1]}
            </p>
          </div>

          <p className="w-full max-w-360 text-center text-base leading-normal lg:mx-0 lg:text-left">
            {roomsContent.description}
          </p>
        </div>

        <div className="flex flex-col">
          {/*<div className="my-0 mb-5 items-center justify-center overflow-x-auto px-4 lg:mb-6 lg:px-5">
            <RoomTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>*/}

          {/* Rooms */}
          <div className="relative">
            <RoomsCarousel
              activeTab={activeTab}
              slides={filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
