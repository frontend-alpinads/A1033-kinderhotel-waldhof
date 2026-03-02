"use client";

import { useState } from "react";
import { useRoomsContent } from "@/contents";
import { Room } from "@/shared-types";

export type TabType = "zimmer-chalet" | "room-types";

export interface Tab {
  label: string;
  value: string;
}

interface UseRoomTabsOptions {
  rooms?: Room[];
}

export function useRoomTabs({ rooms = [] }: UseRoomTabsOptions = {}) {
  const roomsContent = useRoomsContent();

  const TABS: Tab[] = [
    { label: roomsContent.tabs.all, value: "all" },
    { label: roomsContent.tabs.rooms, value: "rooms" },
    { label: roomsContent.tabs.suites, value: "suites" },
  ];

  const showTabs = TABS.length > 2;

  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);

  const roomsData = rooms && rooms.length > 0 ? rooms : [];

  const filteredRooms = roomsData.filter((room) => {
    if (activeTab === "all") return true;
    if (activeTab === "rooms") {
      return ["doppelzimmer", "einzelzimmer"].includes(room.type);
    }
    if (activeTab === "suites") {
      return ["suite", "juniorsuite"].includes(room.type);
    }
    return false;
  });

  return {
    tabs: TABS,
    activeTab,
    setActiveTab,
    filteredRooms,
    roomsData,
    showTabs,
  };
}
