"use client";

import { RoomCard } from "./room-card";
import { RoomsCarousel } from "./rooms-carousel";
import { Room } from "@/shared-types";
import Image from "next/image";
import { useRoomsContent } from "@/contents";
import { useRoomTabs } from "../../hooks/use-room-tabs";

interface RoomsV1Props {
  rooms?: Room[];
}

export function RoomsV1({ rooms }: RoomsV1Props) {
  const roomsContent = useRoomsContent();
  const titleParts = roomsContent.title.split("\n");
  const { activeTab, filteredRooms } = useRoomTabs({ rooms });

  return (
    <section
      id="rooms"
      className="bg-primary text-background relative overflow-hidden py-20 lg:py-30"
    >
      {/* Contents */}
      <div className="relative flex flex-col gap-14 lg:gap-20">
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-5">
          <Image
            src={roomsContent.logoImage}
            alt=""
            width={80}
            height={80}
            className="mb-3"
          />
          <h2 className="text-accent py-2 text-center text-base leading-[150%] tracking-[5%] uppercase lg:mb-1">
            - {roomsContent.badge} -
          </h2>

          <p className="font-title text-foreground-foreground text-display-2 text-center font-normal">
            {titleParts[0]} {titleParts[1]}
          </p>

          <p className="text-background mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80">
            {roomsContent.description}
          </p>
        </div>

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
    </section>
  );
}
