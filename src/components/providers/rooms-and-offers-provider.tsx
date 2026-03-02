"use client";

import { Offer, Room } from "@/shared-types";
import React, { createContext, useContext, ReactNode } from "react";

interface RoomsAndOffersContextType {
  rooms: Room[];
  offers: Offer[];
}

const RoomsAndOffersContext = createContext<
  RoomsAndOffersContextType | undefined
>(undefined);

interface RoomsAndOffersProviderProps {
  children: ReactNode;
  rooms: Room[];
  offers: Offer[];
}

export function RoomsAndOffersProvider({
  children,
  rooms,
  offers,
}: RoomsAndOffersProviderProps) {
  return (
    <RoomsAndOffersContext.Provider value={{ rooms, offers }}>
      {children}
    </RoomsAndOffersContext.Provider>
  );
}

export function useRoomsAndOffers() {
  const context = useContext(RoomsAndOffersContext);
  if (context === undefined) {
    throw new Error(
      "useRoomsAndOffers must be used within a RoomsAndOffersProvider",
    );
  }
  return context;
}
