"use client";

import { RoomCard } from "./room-card";
import { RoomsCarousel } from "./rooms-carousel";
import { Room } from "@/shared-types";
import { useRoomsContent } from "@/contents";
import { RoomTabs } from "../../room-tabs";
import { useRoomTabs } from "../../hooks/use-room-tabs";

interface RoomsV4Props {
  rooms?: Room[];
}

export function RoomsV4({ rooms }: RoomsV4Props) {
  const roomsContent = useRoomsContent();
  const titleParts = roomsContent.title.split("\n");
  const { tabs, activeTab, setActiveTab, filteredRooms } = useRoomTabs({
    rooms,
  });

  return (
    <section
      id="rooms"
      className="bg-background text-foreground relative overflow-hidden lg:px-5"
    >
      {/* Contents */}
      <div className="bg-primary relative flex flex-col gap-14 overflow-hidden py-20 lg:gap-20 lg:py-30">
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:items-start lg:px-5">
          <h2 className="text-accent py-2 text-center text-base leading-[150%] tracking-[5%] uppercase lg:mb-1 lg:text-start">
            - {roomsContent.badge} -
          </h2>

          <p className="font-title text-background text-display-2 text-center font-normal lg:text-start">
            {titleParts[0]} {titleParts[1]}
          </p>

          <p className="text-background w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80 lg:text-start">
            {roomsContent.description}
          </p>
        </div>

        {/* Rooms */}
        <div className="relative flex flex-col gap-5 lg:flex-row lg:gap-0">
          <div className="overflow-x-auto px-4 lg:hidden">
            <RoomTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </div>
          <div className="w-65 shrink-0 pl-5 max-lg:hidden">
            <div className="flex flex-col gap-10">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(tab.value)}
                  className={`cursor-pointer px-8 py-5 text-start text-xl font-normal font-semibold transition-colors ${
                    activeTab === tab.value
                      ? "text-background bg-foreground"
                      : "text-background/50 hover:text-background hover:bg-foreground/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
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
