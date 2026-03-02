"use client";

import { RoomCard } from "./room-card";
import { RoomsCarousel } from "./rooms-carousel";
import { Room } from "@/shared-types";
import { useRoomsContent } from "@/contents";
import { RoomTabs } from "../../room-tabs";
import { useRoomTabs } from "../../hooks/use-room-tabs";

interface RoomsV7Props {
  rooms?: Room[];
}

export function RoomsV7({ rooms }: RoomsV7Props) {
  const roomsContent = useRoomsContent();
  const titleParts = roomsContent.title.split("\n");
  const { tabs, activeTab, setActiveTab, filteredRooms, showTabs } =
    useRoomTabs({
      rooms,
    });

  return (
    <section
      id="rooms"
      className="bg-background text-foreground relative overflow-hidden lg:px-5"
    >
      <div className="bg-muted py-20 lg:py-16">
        {/* Contents */}
        <div className="relative flex flex-col gap-14 lg:gap-20">
          <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-5">
            <h2 className="text-accent py-2 text-center text-base leading-[150%] tracking-[5%] uppercase lg:mb-1">
              - {roomsContent.badge} -
            </h2>

            <p className="font-title text-foreground text-display-2 text-center font-normal">
              {titleParts[0]} {titleParts[1]}
            </p>

            <p className="text-foreground mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80">
              {roomsContent.description}
            </p>
          </div>

          <div className="flex flex-col">
            {showTabs && (
              <div className="my-0 items-center px-4 py-4 max-lg:overflow-x-auto lg:px-5">
                <RoomTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            )}

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
      </div>
    </section>
  );
}
