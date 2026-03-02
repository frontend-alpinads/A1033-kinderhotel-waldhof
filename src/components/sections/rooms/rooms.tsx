"use client";

import { RoomsV1 } from "./variants/rooms-v1";
import { RoomsV2 } from "./variants/rooms-v2";
import { RoomsV3 } from "./variants/rooms-v3";
import { RoomsV4 } from "./variants/rooms-v4";
import { useSectionVariants } from "@/contents";
import { Room } from "@/shared-types";
import { RoomsV5 } from "./variants/rooms-v5";
import { RoomsV6 } from "./variants/rooms-v6";
import { RoomsV7 } from "./variants/rooms-v7";

const roomVariants = {
  v1: RoomsV1,
  v2: RoomsV2,
  v3: RoomsV3,
  v4: RoomsV4,
  v5: RoomsV5,
  v6: RoomsV6,
  v7: RoomsV7,
};

interface RoomsProps {
  rooms?: Room[];
}

export function Rooms({ rooms }: RoomsProps) {
  const { rooms: roomsVariant } = useSectionVariants();
  const RoomsImpl = roomVariants[roomsVariant as keyof typeof roomVariants];
  if (!RoomsImpl) {
    return null;
  }

  return <RoomsImpl rooms={rooms} />;
}
